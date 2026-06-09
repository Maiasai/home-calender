-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RECIPE_CREATED', 'RECIPE_UPDATED', 'MENU_CREATED', 'MENU_UPDATED', 'SHOPPING_CREATED', 'SHOPPING_UPDATED');

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "familyId" UUID NOT NULL,
    "actorUserId" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
