-- Create Enums
CREATE TYPE "VendorStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');
CREATE TYPE "AssignmentStatus" AS ENUM ('ASSIGNED', 'ACCEPTED', 'REJECTED', 'PENDING');
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID');

-- Create Project Table
CREATE TABLE "Project" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Vendors Table
CREATE TABLE "vendors" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT UNIQUE NOT NULL,
  "workspaceId" TEXT,
  "businessName" TEXT NOT NULL,
  "ownerName" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "phone" TEXT,
  "gstNumber" TEXT,
  "panNumber" TEXT,
  "warehouseAddress" TEXT,
  "serviceLocations" TEXT[],
  "status" "VendorStatus" NOT NULL DEFAULT 'SUBMITTED',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Vendor Profiles Table
CREATE TABLE "vendor_profiles" (
  "id" TEXT PRIMARY KEY,
  "vendorId" TEXT UNIQUE NOT NULL,
  "gstCertificate" TEXT,
  "panCard" TEXT,
  "bankDetails" TEXT,
  "approvalStatus" TEXT NOT NULL DEFAULT 'PENDING',
  "rejectionReason" TEXT,
  "approvedBy" TEXT,
  "approvedAt" TIMESTAMP
);

-- Create Vendor Products Table
CREATE TABLE "vendor_products" (
  "id" TEXT PRIMARY KEY,
  "vendorId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "subcategory" TEXT NOT NULL,
  "sku" TEXT UNIQUE NOT NULL,
  "description" TEXT,
  "basePrice" DECIMAL(10, 2) NOT NULL,
  "images" TEXT[],
  "isArchived" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Product Variants Table
CREATE TABLE "ProductVariant" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "color" TEXT,
  "material" TEXT,
  "size" TEXT,
  "priceAdjustment" DECIMAL(10, 2) NOT NULL DEFAULT 0,
  "skuSuffix" TEXT
);

-- Create Inventory Table
CREATE TABLE "Inventory" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT UNIQUE NOT NULL,
  "availableQty" INTEGER NOT NULL DEFAULT 0,
  "reservedQty" INTEGER NOT NULL DEFAULT 0,
  "incomingQty" INTEGER NOT NULL DEFAULT 0,
  "lastUpdated" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Inventory Transactions Table
CREATE TABLE "inventory_transactions" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "referenceId" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Vendor Assignments Table
CREATE TABLE "vendor_assignments" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "itemId" TEXT NOT NULL,
  "vendorId" TEXT NOT NULL,
  "status" "AssignmentStatus" NOT NULL DEFAULT 'ASSIGNED',
  "remarks" TEXT,
  "acceptedAt" TIMESTAMP,
  "rejectedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Item Status History Table
CREATE TABLE "item_status_history" (
  "id" TEXT PRIMARY KEY,
  "assignmentId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "updatedBy" TEXT NOT NULL,
  "remarks" TEXT,
  "timestamp" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Item Proof Images Table
CREATE TABLE "item_proof_images" (
  "id" TEXT PRIMARY KEY,
  "assignmentId" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "imageType" TEXT NOT NULL,
  "caption" TEXT,
  "uploadedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Vendor Payouts Table
CREATE TABLE "vendor_payouts" (
  "id" TEXT PRIMARY KEY,
  "vendorId" TEXT NOT NULL,
  "amount" DECIMAL(10, 2) NOT NULL,
  "projectId" TEXT NOT NULL,
  "payoutDate" TIMESTAMP,
  "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
  "statementUrl" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Vendor Notifications Table
CREATE TABLE "vendor_notifications" (
  "id" TEXT PRIMARY KEY,
  "vendorId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Vendor Performance Table
CREATE TABLE "vendor_performance" (
  "id" TEXT PRIMARY KEY,
  "vendorId" TEXT UNIQUE NOT NULL,
  "acceptanceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "delayPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "customerRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "avgDeliveryTime" INTEGER NOT NULL DEFAULT 0,
  "lastUpdated" TIMESTAMP NOT NULL DEFAULT NOW()
);
