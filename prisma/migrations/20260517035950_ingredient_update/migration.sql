-- CreateEnum
CREATE TYPE "VegetableType" AS ENUM ('GREEN_YELLOW', 'LIGHT');

-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "vegetableType" "VegetableType";
