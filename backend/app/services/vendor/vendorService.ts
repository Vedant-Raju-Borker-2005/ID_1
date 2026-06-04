import { prisma } from "@/lib/prisma";
import { VendorStatus, AssignmentStatus, PayoutStatus } from "@prisma/client";
import { z } from "zod";
import { uploadFile } from "@/lib/storage";

// Schemas
export const VendorOnboardingSchema = z.object({
  businessName: z.string().min(3, "Business name must be at least 3 characters"),
  ownerName: z.string().min(3, "Owner name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required").optional(),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  warehouseAddress: z.string().optional(),
  serviceLocations: z.array(z.string().min(6, "Invalid pincode")),
});

export const ProductSchema = z.object({
  name: z.string().min(3),
  category: z.enum(["Furniture", "Kitchen", "Lighting", "Decor", "Appliances"]),
  subcategory: z.string(),
  sku: z.string().min(5),
  description: z.string().optional(),
  basePrice: z.number().positive(),
  images: z.array(z.string().url()).max(5),
  variants: z.array(z.object({
    color: z.string().optional(),
    material: z.string().optional(),
    size: z.string().optional(),
    priceAdjustment: z.number().default(0),
  })),
});

export class VendorService {
  // 1. Onboarding & Profile
  static async registerVendor(userId: string, data: z.infer<typeof VendorOnboardingSchema>) {
    const existing = await prisma.vendor.findUnique({ where: { userId } });
    if (existing) throw new Error("Vendor profile already exists");

    const vendor = await prisma.vendor.create({
      data: {
        userId,
        businessName: data.businessName,
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        gstNumber: data.gstNumber,
        panNumber: data.panNumber,
        warehouseAddress: data.warehouseAddress,
        serviceLocations: data.serviceLocations,
        status: VendorStatus.SUBMITTED,
      },
    });

    // Create default profile
    await prisma.vendorProfile.create({
      data: {
        vendorId: vendor.id,
        approvalStatus: "PENDING",
      },
    });

    // Trigger Notification (A6 - Automation)
    await this.createNotification(vendor.id, "NEW_VENDOR", "Welcome to the vendor network");

    return vendor;
  }

  static async uploadDocuments(vendorId: string, files: any[]) {
    const uploadPromises = files.map(async (file) => {
      const url = await uploadFile(file);
      return { url, type: file.mimetype || 'application/octet-stream' };
    });
    const results = await Promise.all(uploadPromises);
    
    // Update profile based on file type (simplified logic)
    const updateData: any = {};
    results.forEach((res) => {
      if (res.type.includes('gst') || res.url.includes('gst')) updateData.gstCertificate = res.url;
      if (res.type.includes('pan') || res.url.includes('pan')) updateData.panCard = res.url;
      if (res.type.includes('bank') || res.url.includes('bank')) updateData.bankDetails = res.url;
    });

    await prisma.vendorProfile.update({
      where: { vendorId },
      data: updateData,
    });

    return results;
  }

  // 2. Dashboard & Analytics
  static async getVendorDashboard(userId: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      include: {
        assignments: {
          where: { status: { in: [AssignmentStatus.ACCEPTED, AssignmentStatus.ASSIGNED] } },
          include: { project: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        payouts: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        performance: true,
      },
    });

    if (!vendor) throw new Error("Vendor not found");

    const kpi = {
      totalProjects: vendor.assignments.length,
      pendingItems: vendor.assignments.filter(a => a.status === AssignmentStatus.ASSIGNED).length,
      completedItems: vendor.assignments.filter(a => a.status === AssignmentStatus.ACCEPTED).length,
      monthlyEarnings: vendor.payouts.filter(p => p.status === PayoutStatus.PAID).reduce((acc, curr) => acc + Number(curr.amount), 0),
      lifetimeEarnings: vendor.payouts.reduce((acc, curr) => acc + Number(curr.amount), 0),
      acceptanceRate: vendor.performance?.acceptanceRate || 0,
      completionRate: vendor.performance?.completionRate || 0,
    };

    return { ...vendor, kpi };
  }

  // 3. Inventory Management
  static async updateInventory(productId: string, qty: number, type: 'ADDED' | 'RESERVED' | 'RELEASED') {
    const inv = await prisma.inventory.findUnique({ where: { productId } });
    if (!inv) throw new Error("Inventory record not found");

    await prisma.inventoryTransaction.create({
      data: {
        productId,
        type,
        quantity: qty,
        notes: `Stock ${type} by vendor`,
      },
    });

    const updateData: any = {};
    if (type === 'ADDED') updateData.availableQty = { increment: qty };
    if (type === 'RESERVED') {
      updateData.reservedQty = { increment: qty };
      updateData.availableQty = { decrement: qty };
    }
    if (type === 'RELEASED') {
      updateData.reservedQty = { decrement: qty };
      updateData.availableQty = { increment: qty };
    }

    await prisma.inventory.update({
      where: { productId },
      data: updateData,
    });

    // Check Low Stock Alert
    const updated = await prisma.inventory.findUnique({ where: { productId } });
    if (updated && updated.availableQty < 5) {
      await this.createNotification(inv.productId, "LOW_STOCK", "Inventory low");
    }
  }

  // 4. Assignments & Execution
  static async acceptAssignment(assignmentId: string, userId: string) {
    const assignment = await prisma.vendorAssignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) throw new Error("Assignment not found");
    if (assignment.status !== AssignmentStatus.ASSIGNED) throw new Error("Assignment already processed");

    const updated = await prisma.vendorAssignment.update({
      where: { id: assignmentId },
      data: { 
        status: AssignmentStatus.ACCEPTED, 
        acceptedAt: new Date(), 
        remarks: "Accepted via dashboard" 
      },
      include: { project: true },
    });

    // Update Performance Metrics
    await this.updatePerformanceMetrics(assignment.vendorId);

    // Trigger Notification
    await this.createNotification(assignment.vendorId, "ASSIGNMENT_ACCEPTED", "Assignment accepted successfully");

    return updated;
  }

  static async updateItemStatus(assignmentId: string, status: string, remarks: string) {
    await prisma.itemStatusHistory.create({
      data: {
        assignmentId,
        status,
        updatedBy: "vendor_user_id",
        remarks,
        timestamp: new Date(),
      },
    });
  }

  // 5. Payouts
  static async getEarningsSummary(vendorId: string) {
    return prisma.vendorPayout.groupBy({
      by: ['status'],
      _sum: { amount: true },
      where: { vendorId },
    });
  }

  // Helper: Notification
  static async createNotification(vendorId: string, type: string, message: string) {
    await prisma.vendorNotification.create({
      data: {
        vendorId,
        type,
        message,
        isRead: false,
      },
    });
  }

  // Helper: Performance Metrics
  static async updatePerformanceMetrics(vendorId: string) {
    const assignments = await prisma.vendorAssignment.findMany({
      where: { vendorId },
      select: { status: true, acceptedAt: true, createdAt: true },
    });

    const total = assignments.length;
    const accepted = assignments.filter(a => a.status === AssignmentStatus.ACCEPTED).length;
    const completed = assignments.filter(a => a.status === AssignmentStatus.ACCEPTED).length;

    const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    await prisma.vendorPerformance.upsert({
      where: { vendorId },
      create: { vendorId, acceptanceRate, completionRate },
      update: { acceptanceRate, completionRate },
    });
  }

  // Add mock catalog product helper
  static async createProduct(vendorId: string, data: any) {
    const product = await prisma.vendorProduct.create({
      data: {
        vendorId,
        name: data.name,
        category: data.category,
        subcategory: data.subcategory,
        sku: data.sku,
        description: data.description,
        basePrice: data.basePrice,
        images: data.images || [],
        variants: {
          create: data.variants || [],
        },
      },
    });

    // Initialize inventory record for this product
    await prisma.inventory.create({
      data: {
        productId: product.id,
        availableQty: 10, // Default stock
      },
    });

    return product;
  }
}
