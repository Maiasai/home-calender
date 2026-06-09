/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ingredients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "NutritionCategory" AS ENUM ('PROTEIN', 'VEGETABLE');

-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "nutritionCategory" "NutritionCategory";

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_name_key" ON "ingredients"("name");
