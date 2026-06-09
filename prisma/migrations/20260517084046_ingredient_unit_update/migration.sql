-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "gramValue" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "unit_id" UUID;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
