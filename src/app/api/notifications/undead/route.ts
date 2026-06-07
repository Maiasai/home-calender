//ヘッダー　未読アイコン用　hasUnread返す用のみ

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'active family is not set' },
        { status: 400 },
      );
    }

    const lastViewedAt = dbUser.notificationLastViewedAt;

    const data = await prisma.notification.findMany({
      where: {
        familyId: dbUser.activeFamilyId,
        actorUserId: { not: dbUser.id }, //意味）actorUserId が dbUser.id ではない通知
      },
    });

    const hasUnread = !lastViewedAt
      ? data?.length > 0
      : data.some((form) => form.createdAt > lastViewedAt);

    return NextResponse.json({ hasUnread }, { status: 200 });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};
