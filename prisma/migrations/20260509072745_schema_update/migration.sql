/*
  Warnings:

  - Made the column `family_id` on table `FamilyMember` required. This step will fail if there are existing NULL values in that column.
  - Made the column `family_id` on table `Menu` required. This step will fail if there are existing NULL values in that column.
  - Made the column `family_id` on table `ShoppingItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `family_id` on table `recipes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FamilyMember" DROP CONSTRAINT "FamilyMember_family_id_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_family_id_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingItem" DROP CONSTRAINT "ShoppingItem_family_id_fkey";

-- DropForeignKey
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_family_id_fkey";

-- AlterTable
ALTER TABLE "FamilyMember" ALTER COLUMN "family_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "family_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "ShoppingItem" ALTER COLUMN "family_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "recipes" ALTER COLUMN "family_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingItem" ADD CONSTRAINT "ShoppingItem_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
