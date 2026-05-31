//共有設定一覧　招待中メンバー型

import { InviteStatus } from '@/generated/prisma';

export type InvitesType = {
  id: string;
  email: string;
  status: InviteStatus;
  createdAt: Date;
};
