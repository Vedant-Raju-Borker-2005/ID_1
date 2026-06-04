import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/middleware/authMiddleware";

export async function vendorGuard(req: Request) {
  try {
    const user = await verifyAuth(req);
    if (!user) return null;

    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.id },
      include: { profile: true },
    });
    
    if (!vendor) {
      return null; // Not a vendor
    }

    // Check if vendor status is APPROVED for restricted actions
    if (vendor.status !== 'APPROVED') {
      return { vendor, restricted: true };
    }

    return { vendor, restricted: false };
  } catch (error) {
    return null;
  }
}
