/*
  Warnings:

  - You are about to drop the column `gramValue` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the column `unit_id` on the `ingredients` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_unit_id_fkey";

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "gramValue";

-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "unit_id";
