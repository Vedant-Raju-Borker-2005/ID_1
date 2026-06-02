import { NextRequest, NextResponse } from "next/server";
import { VendorService } from "../../../services/vendor/vendorService";
import { verifyAuth } from "../../../../src/middleware/authMiddleware";
import { VendorOnboardingSchema } from "../../../schemas/vendor/onboarding";

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const contentType = req.headers.get("content-type") || "";
    let parsedData: any;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      parsedData = {
        businessName: formData.get("businessName") as string,
        ownerName: formData.get("ownerName") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || undefined,
        gstNumber: (formData.get("gstNumber") as string) || undefined,
        panNumber: (formData.get("panNumber") as string) || undefined,
        warehouseAddress: (formData.get("warehouseAddress") as string) || undefined,
        serviceLocations: JSON.parse((formData.get("serviceLocations") as string) || "[]"),
      };
    } else {
      parsedData = await req.json().catch(() => ({}));
    }

    const validated = VendorOnboardingSchema.parse(parsedData);
    const vendor = await VendorService.registerVendor(user.id, validated);
    
    return NextResponse.json(vendor, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const files = formData.getAll("documents") as any[];
    const vendorId = formData.get("vendorId") as string;

    if (!vendorId) {
      return NextResponse.json({ error: "Missing vendorId parameter" }, { status: 400 });
    }

    const results = await VendorService.uploadDocuments(vendorId, files);
    return NextResponse.json({ success: true, documents: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
