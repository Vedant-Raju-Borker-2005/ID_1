import { NextRequest, NextResponse } from "next/server";
import { VendorService } from "../../../services/vendor/vendorService";
import { verifyAuth } from "../../../../src/middleware/authMiddleware";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dashboard = await VendorService.getVendorDashboard(user.id);
    return NextResponse.json(dashboard);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Vendor data not found" }, { status: 404 });
  }
}
