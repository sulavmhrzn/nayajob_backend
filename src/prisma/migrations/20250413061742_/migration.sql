-- DropForeignKey
ALTER TABLE "educations" DROP CONSTRAINT "educations_seeker_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "employer_profiles" DROP CONSTRAINT "employer_profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "experiences" DROP CONSTRAINT "experiences_seeker_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "seeker_profiles" DROP CONSTRAINT "seeker_profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_seeker_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "social_links" DROP CONSTRAINT "social_links_seeker_profile_id_fkey";

-- AddForeignKey
ALTER TABLE "employer_profiles" ADD CONSTRAINT "employer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seeker_profiles" ADD CONSTRAINT "seeker_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_seeker_profile_id_fkey" FOREIGN KEY ("seeker_profile_id") REFERENCES "seeker_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_seeker_profile_id_fkey" FOREIGN KEY ("seeker_profile_id") REFERENCES "seeker_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educations" ADD CONSTRAINT "educations_seeker_profile_id_fkey" FOREIGN KEY ("seeker_profile_id") REFERENCES "seeker_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_seeker_profile_id_fkey" FOREIGN KEY ("seeker_profile_id") REFERENCES "seeker_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
