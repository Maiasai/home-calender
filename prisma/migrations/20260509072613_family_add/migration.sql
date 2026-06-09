/*
  Warnings:

  - A unique constraint covering the columns `[family_id,date]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Menu_userId_date_key";

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "family_id" UUID;

-- AlterTable
ALTER TABLE "ShoppingItem" ADD COLUMN     "family_id" UUID;

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "family_id" UUID;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "activeFamilyId" UUID;

-- CreateTable
CREATE TABLE "Family" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "family_id" UUID,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_userId_family_id_key" ON "FamilyMember"("userId", "family_id");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_family_id_date_key" ON "Menu"("family_id", "date");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_activeFamilyId_fkey" FOREIGN KEY ("activeFamilyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingItem" ADD CONSTRAINT "ShoppingItem_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;
