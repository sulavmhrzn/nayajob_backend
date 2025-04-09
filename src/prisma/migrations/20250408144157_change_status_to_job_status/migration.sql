/*
  Warnings:

  - Changed the type of `status` on the `job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('ACTIVE', 'DRAFT', 'EXPIRED');

-- AlterTable
ALTER TABLE "job" DROP COLUMN "status",
ADD COLUMN     "status" "JobStatus" NOT NULL;

-- DropEnum
DROP TYPE "Status";
