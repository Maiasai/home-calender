/*
  Warnings:

  - You are about to drop the column `unitName` on the `ShoppingItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShoppingItem" DROP COLUMN "unitName",
ADD COLUMN     "unitId" UUID;

-- AddForeignKey
ALTER TABLE "ShoppingItem" ADD CONSTRAINT "ShoppingItem_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
