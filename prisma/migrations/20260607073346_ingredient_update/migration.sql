/*
  Warnings:

  - A unique constraint covering the columns `[family_id,normalized_name]` on the table `ingredients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `family_id` to the `ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "family_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_family_id_normalized_name_key" ON "ingredients"("family_id", "normalized_name");

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
