-- AlterTable
ALTER TABLE "ShoppingItem" ADD COLUMN     "memo" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;
