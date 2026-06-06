//通知　共通関数

import { prisma } from './prisma';

export type CreateNotificationProps = {
  familyId: string;
  actorUserId: string;
  type:
    | 'RECIPE_CREATED'
    | 'RECIPE_UPDATED'
    | 'MENU_CREATED'
    | 'MENU_UPDATED'
    | 'SHOPPING_CREATED'
    | 'SHOPPING_UPDATED';
};

export const createNotification = async ({
  familyId,
  actorUserId,
  type,
}: CreateNotificationProps) => {
  const overwriteTypes = ['RECIPE_UPDATED', 'MENU_UPDATED', 'SHOPPING_UPDATED'];
  if (overwriteTypes.includes(type)) {
    const existing = await prisma.notification.findFirst({
      where: {
        familyId,
        actorUserId,
        type,
      },
    });

    if (existing) {
      return await prisma.notification.update({
        where: {
          id: existing.id,
        },

        data: {
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }
  await prisma.notification.create({
    data: {
      familyId,
      actorUserId,
      type,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });
};
