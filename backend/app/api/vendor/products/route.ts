import { NextRequest, NextResponse } from "next/server";
import { vendorGuard } from "@/app/middleware/vendorGuard";
import { VendorService } from "@/app/services/vendor/vendorService";

export async function POST(req: NextRequest) {
  const authResult = await vendorGuard(req);
  if (!authResult || authResult.restricted) {
    return NextResponse.json({ error: "Vendor not approved" }, { status: 403 });
  }

  try {
    const vendor = authResult.vendor;
    const body = await req.json().catch(() => ({}));
    
    const product = await VendorService.createProduct(vendor.id, body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 400 });
  }
}
