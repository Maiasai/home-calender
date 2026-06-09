/*
  Warnings:

  - You are about to drop the column `hasCooked` on the `user_recipe_status` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_recipe_status" DROP COLUMN "hasCooked";

-- CreateTable
CREATE TABLE "family_recipe_status" (
    "id" UUID NOT NULL,
    "familyId" UUID NOT NULL,
    "recipeId" UUID NOT NULL,
    "hasCooked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_recipe_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "family_recipe_status_familyId_recipeId_key" ON "family_recipe_status"("familyId", "recipeId");

-- AddForeignKey
ALTER TABLE "family_recipe_status" ADD CONSTRAINT "family_recipe_status_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_recipe_status" ADD CONSTRAINT "family_recipe_status_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
