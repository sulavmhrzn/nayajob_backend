-- CreateEnum
CREATE TYPE "JobCategory" AS ENUM ('IT', 'Marketing', 'Sales', 'Finance', 'Healthcare', 'Education', 'Design', 'CustomerService', 'Engineering', 'HR', 'ContentWriting', 'Operations', 'Legal', 'Consulting', 'ProjectManagement', 'Architecture');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FullTime', 'PartTime', 'Freelance', 'Contract', 'Internship', 'Remote');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'DRAFT', 'EXPIRED');

-- CreateTable
CREATE TABLE "job" (
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
    "status" "Status" NOT NULL,
    "boosted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "employer_id" INTEGER NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "employer_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
