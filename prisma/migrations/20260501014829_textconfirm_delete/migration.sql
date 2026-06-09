/*
  Warnings:

  - The values [TEXT,CONFIRM] on the enum `RecipeSourceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RecipeSourceType_new" AS ENUM ('MANUAL', 'URL');
ALTER TABLE "recipes" ALTER COLUMN "source_type" TYPE "RecipeSourceType_new" USING ("source_type"::text::"RecipeSourceType_new");
ALTER TYPE "RecipeSourceType" RENAME TO "RecipeSourceType_old";
ALTER TYPE "RecipeSourceType_new" RENAME TO "RecipeSourceType";
DROP TYPE "public"."RecipeSourceType_old";
COMMIT;
