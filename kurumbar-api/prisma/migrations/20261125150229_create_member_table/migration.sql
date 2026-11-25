BEGIN;

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "nameTa" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dob" TEXT,
    "bloodGroup" TEXT,
    "fatherName" TEXT,
    "maritalStatus" TEXT,
    "childrenMale" INTEGER DEFAULT 0,
    "childrenFemale" INTEGER DEFAULT 0,
    "district" TEXT NOT NULL,
    "constituency" TEXT,
    "address" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "kulam" TEXT NOT NULL,
    "kuladeivam" TEXT,
    "education" TEXT,
    "professionSector" TEXT,
    "jobTitle" TEXT,
    "houseType" TEXT,
    "landAvailable" TEXT,
    "landDetails" TEXT,
    "photoUrl" TEXT,
    "aadhaarMasked" TEXT,
    "status" "MemberStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_membershipId_key" ON "members"("membershipId");

-- CreateIndex
CREATE UNIQUE INDEX "members_mobile_key" ON "members"("mobile");

-- CreateIndex
CREATE INDEX "members_mobile_idx" ON "members"("mobile");

-- CreateIndex
CREATE INDEX "members_membershipId_idx" ON "members"("membershipId");

-- CreateIndex
CREATE INDEX "members_district_idx" ON "members"("district");

-- CreateIndex
CREATE INDEX "members_status_idx" ON "members"("status");

COMMIT;
