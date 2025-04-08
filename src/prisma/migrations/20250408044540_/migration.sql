/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `employer_profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `employer_profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employer_profile" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "employer_profile_user_id_key" ON "employer_profile"("user_id");

-- AddForeignKey
ALTER TABLE "employer_profile" ADD CONSTRAINT "employer_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
