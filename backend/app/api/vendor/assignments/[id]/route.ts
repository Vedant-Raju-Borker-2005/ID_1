import { NextRequest, NextResponse } from "next/server";
import { VendorService } from "@/app/services/vendor/vendorService";
import { verifyAuth } from "@/middleware/authMiddleware";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const vendor = await prisma.vendor.findUnique({ where: { userId: user.id } });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    const assignment = await prisma.vendorAssignment.findUnique({ where: { id: params.id } });
    if (!assignment || assignment.vendorId !== vendor.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { status, remarks } = body;

    if (status === 'ACCEPTED') {
      await VendorService.acceptAssignment(params.id, user.id);
    } else if (status === 'REJECTED') {
      await prisma.vendorAssignment.update({
        where: { id: params.id },
        data: { status: 'REJECTED', rejectedAt: new Date(), remarks: remarks || 'Rejected via API' },
      });
    }

    if (status && status !== 'ACCEPTED' && status !== 'REJECTED') {
      await VendorService.updateItemStatus(params.id, status, remarks || '');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Update failed" }, { status: 500 });
  }
}
