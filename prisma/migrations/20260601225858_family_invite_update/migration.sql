/*
  Warnings:

  - You are about to drop the column `status` on the `FamilyInvite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FamilyInvite" DROP COLUMN "status";

-- DropEnum
DROP TYPE "InviteStatus";
