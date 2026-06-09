-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_homeFamilyId_fkey" FOREIGN KEY ("homeFamilyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;
