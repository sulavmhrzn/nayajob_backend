/*
  Warnings:

  - You are about to drop the `employer_profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "employer_profile" DROP CONSTRAINT "employer_profile_user_id_fkey";

-- DropForeignKey
ALTER TABLE "job" DROP CONSTRAINT "job_employer_id_fkey";

-- DropTable
DROP TABLE "employer_profile";

-- DropTable
DROP TABLE "job";

-- CreateTable
CREATE TABLE "employer_profiles" (
    "id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_description" TEXT NOT NULL,
    "company_website" TEXT NOT NULL,
    "company_logo" TEXT NOT NULL,
    "company_size" "CompanySize" NOT NULL DEFAULT 'SMALL',
    "company_type" "CompanyType" NOT NULL,
    "company_industry_type" "IndustryType" NOT NULL,
    "company_location" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "description_summary" TEXT,
    "category" "JobCategory" NOT NULL,
    "minimum_salary" INTEGER,
    "maximum_salary" INTEGER,
    "job_type" "JobType" NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "JobStatus" NOT NULL,
    "boosted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "employer_id" INTEGER NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employer_profiles_user_id_key" ON "employer_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "employer_profiles" ADD CONSTRAINT "employer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "employer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
