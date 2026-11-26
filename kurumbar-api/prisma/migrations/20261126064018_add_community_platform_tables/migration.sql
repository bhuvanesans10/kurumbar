BEGIN;

-- CreateEnum
CREATE TYPE "MatrimonyStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'MARRIED');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('LIVESTOCK', 'WOOL_RUGS', 'HONEY', 'MILLETS', 'HERBAL', 'HANDICRAFT', 'OTHER');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'SOLD', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'GOVERNMENT', 'APPRENTICESHIP', 'CONTRACT');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('FESTIVAL', 'SCHOLARSHIP', 'MEETING', 'WELFARE', 'GENERAL');

-- CreateTable
CREATE TABLE "matrimony_profiles" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "nameTa" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "age" INTEGER NOT NULL,
    "dob" TEXT,
    "height" TEXT,
    "education" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "income" TEXT,
    "kulam" TEXT NOT NULL,
    "subKulam" TEXT,
    "raasi" TEXT,
    "nakshatram" TEXT,
    "district" TEXT NOT NULL,
    "city" TEXT,
    "fatherName" TEXT,
    "motherName" TEXT,
    "contactPhone" TEXT NOT NULL,
    "photoUrl" TEXT,
    "expectations" TEXT,
    "status" "MatrimonyStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matrimony_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_products" (
    "id" TEXT NOT NULL,
    "titleTa" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "sellerName" TEXT NOT NULL,
    "sellerPhone" TEXT NOT NULL,
    "sellerDistrict" TEXT NOT NULL,
    "location" TEXT,
    "descriptionTa" TEXT,
    "descriptionEn" TEXT,
    "imageUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_postings" (
    "id" TEXT NOT NULL,
    "titleTa" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "jobType" "JobType" NOT NULL DEFAULT 'FULL_TIME',
    "salaryRange" TEXT,
    "experience" TEXT,
    "education" TEXT,
    "description" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_articles" (
    "id" TEXT NOT NULL,
    "titleTa" TEXT NOT NULL,
    "titleEn" TEXT,
    "category" "NewsCategory" NOT NULL,
    "summaryTa" TEXT NOT NULL,
    "summaryEn" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "eventDate" TEXT,
    "eventLocation" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "matrimony_profiles_profileId_key" ON "matrimony_profiles"("profileId");

-- CreateIndex
CREATE INDEX "matrimony_profiles_gender_idx" ON "matrimony_profiles"("gender");

-- CreateIndex
CREATE INDEX "matrimony_profiles_kulam_idx" ON "matrimony_profiles"("kulam");

-- CreateIndex
CREATE INDEX "matrimony_profiles_district_idx" ON "matrimony_profiles"("district");

-- CreateIndex
CREATE INDEX "matrimony_profiles_status_idx" ON "matrimony_profiles"("status");

-- CreateIndex
CREATE INDEX "market_products_category_idx" ON "market_products"("category");

-- CreateIndex
CREATE INDEX "market_products_sellerDistrict_idx" ON "market_products"("sellerDistrict");

-- CreateIndex
CREATE INDEX "market_products_status_idx" ON "market_products"("status");

-- CreateIndex
CREATE INDEX "job_postings_district_idx" ON "job_postings"("district");

-- CreateIndex
CREATE INDEX "job_postings_jobType_idx" ON "job_postings"("jobType");

-- CreateIndex
CREATE INDEX "job_postings_status_idx" ON "job_postings"("status");

-- CreateIndex
CREATE INDEX "news_articles_category_idx" ON "news_articles"("category");

-- CreateIndex
CREATE INDEX "news_articles_isPublished_idx" ON "news_articles"("isPublished");

COMMIT;
