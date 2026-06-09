/*
  Warnings:

  - You are about to drop the column `source_text` on the `recipes` table. All the data in the column will be lost.
  - Made the column `title` on table `recipes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "source_text",
ALTER COLUMN "title" SET NOT NULL;
