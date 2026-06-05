//通知取得API

import { InviteNotificationsType } from '@/app/(main)/notifications/_typs/InviteNotificationsType';
import { NotificationsType } from '@/app/(main)/notifications/_typs/NotificationsType';
import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    //今ログインしている人を取得
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

    const invitedata = await prisma.familyInvite.findMany({
      where: {
        email: dbUser.email,
      },
      include: {
        family: {
          include: {
            owner: true,
          },
        },
      },
    });

    const notification = await prisma.notification.findMany({
      where: {
        familyId: dbUser.activeFamilyId,
        actorUserId: { not: dbUser.id },
      },
      include: {
        actorUser: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const nformatted: NotificationsType[] = notification.map((n) => ({
      id: n.id,
      familyId: n.familyId,
      actorUserId: n.actorUserId,
      type: n.type,
      createdAt: n.createdAt,
      nickname: n.actorUser?.nickname ?? '',
    }));

    const formatted: InviteNotificationsType[] = invitedata.map((m) => ({
      id: m.id,
      familyId: m.familyId,
      email: m.email,
      createdAt: m.family.createdAt,
      nickname: m.family.owner?.nickname ?? '',
    }));

    const NewDate = dbUser?.notificationLastViewedAt;

    const hasUnread = !NewDate
      ? nformatted.length > 0
      : nformatted.some((f) => f.createdAt > NewDate);

    return NextResponse.json(
      { invites: formatted, notifications: nformatted, hasUnread },
      { status: 200 },
    );
  } catch (error) {
    console.log('error', error);
    console.log('GET /api/notifications error:', error);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
};
