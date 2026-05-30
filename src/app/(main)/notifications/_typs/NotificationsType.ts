//通知設定　型

import { InviteStatus } from '@/generated/prisma';

export type NotificationsType = {
  id: string;
  familyId: string;
  email: string;
  status: InviteStatus;
  createdAt: Date;
  name: string;
  nickname: string;
};
