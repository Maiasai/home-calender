//通知設定（招待以外）　型

import { NotificationType } from '@/generated/prisma';

export type NotificationsType = {
  id: string;
  familyId: string;
  actorUserId: string;
  type: NotificationType;
  createdAt: Date;
  nickname: string;
};
