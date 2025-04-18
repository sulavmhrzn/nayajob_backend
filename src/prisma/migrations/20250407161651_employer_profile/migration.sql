-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('STARTUP', 'SME', 'CORPORATE', 'NON_PROFIT', 'GOVERNMENT', 'AGENCY', 'FREELANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "IndustryType" AS ENUM ('TECHNOLOGY', 'HEALTHCARE', 'FINANCE', 'EDUCATION', 'RETAIL', 'MANUFACTURING', 'MEDIA', 'MARKETING', 'CONSULTING', 'HOSPITALITY', 'REAL_ESTATE', 'CONSTRUCTION', 'ENTERTAINMENT', 'TRANSPORTATION', 'AGRICULTURE', 'ENERGY', 'LEGAL', 'TELECOMMUNICATIONS', 'PHARMACEUTICAL', 'AUTOMOTIVE', 'AEROSPACE', 'BIOTECHNOLOGY', 'LOGISTICS', 'FOOD_AND_BEVERAGE', 'FASHION', 'GAMING', 'SPORTS', 'ENVIRONMENTAL', 'ARTS', 'NONPROFIT', 'GOVERNMENT', 'INSURANCE', 'SECURITY', 'HUMAN_RESOURCES', 'E_COMMERCE', 'OTHER');

-- CreateTable
CREATE TABLE "EmployerProfile" (
    "id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_description" TEXT NOT NULL,
    "company_website" TEXT NOT NULL,
    "company_logo" TEXT NOT NULL,
    "company_size" "CompanySize" NOT NULL DEFAULT 'SMALL',
    "company_type" "CompanyType" NOT NULL,
    "company_industry_type" "IndustryType" NOT NULL,
    "company_location" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployerProfile_pkey" PRIMARY KEY ("id")
);
