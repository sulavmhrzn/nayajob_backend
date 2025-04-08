/*
  Warnings:

  - You are about to drop the `EmployerProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "EmployerProfile";

-- CreateTable
CREATE TABLE "employer_profile" (
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

    CONSTRAINT "employer_profile_pkey" PRIMARY KEY ("id")
);
