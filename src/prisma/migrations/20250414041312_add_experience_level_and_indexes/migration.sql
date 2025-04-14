-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('INTERN', 'ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "experience_level" "ExperienceLevel" NOT NULL DEFAULT 'ENTRY';

-- CreateIndex
CREATE INDEX "idx_job_experience_level" ON "jobs"("experience_level");

-- CreateIndex
CREATE INDEX "idx_job_category" ON "jobs"("category");

-- CreateIndex
CREATE INDEX "idx_job_type" ON "jobs"("job_type");
