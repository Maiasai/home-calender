//通知設定　型

import { InviteStatus } from '@/generated/prisma';

export type NotificationsType = {
  email: string;
  family: familyType;
  familyId: string;
  id: string;
  status: InviteStatus;
};

export type familyType = {
  createdAt: Date;
  id: string;
  name: string;
};
