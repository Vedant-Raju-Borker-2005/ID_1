import { z } from "zod";

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

export type VendorOnboardingInput = z.infer<typeof VendorOnboardingSchema>;
