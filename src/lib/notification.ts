//通知　共通関数

import { prisma } from './prisma';

type CreateNotificationProps = {
  familyId: string;
  actorUserId: string;
  type: 'RECIPE_CREATED' | 'RECIPE_UPDATED' | 'MENU_CREATED' | 'MENU_UPDATED';
};

export const createNotification = async ({
  familyId,
  actorUserId,
  type,
}: CreateNotificationProps) => {
  await prisma.notification.create({
    data: {
      familyId,
      actorUserId,
      type,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 1000),
    },
  });
};
