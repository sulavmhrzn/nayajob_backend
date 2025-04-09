-- CreateIndex
CREATE INDEX "idx_job_status" ON "jobs"("status");

-- CreateIndex
CREATE INDEX "idx_job_created_at" ON "jobs"("created_at");

-- CreateIndex
CREATE INDEX "idx_job_employer_id" ON "jobs"("employer_id");