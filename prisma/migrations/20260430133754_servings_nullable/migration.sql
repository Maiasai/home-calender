/*
  Warnings:

  - The primary key for the `ShoppingItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `updatedAt` to the `ShoppingItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShoppingItem" DROP CONSTRAINT "ShoppingItem_pkey",
ADD COLUMN     "ingredientId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ShoppingItem_pkey" PRIMARY KEY ("id");
