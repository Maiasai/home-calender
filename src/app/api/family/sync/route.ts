//同期ON/OFF　API

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { SyncRequest } from './_typs/SyncRequest';

export const PATCH = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);
    const { syncEnabled }: SyncRequest = await request.json();

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser?.activeFamilyId || !dbUser.homeFamilyId) {
      return NextResponse.json({ message: 'family not set' }, { status: 400 });
    }

    const currentFamilyId = dbUser.activeFamilyId;
    const homeFamilyId = dbUser.homeFamilyId;

    if (!syncEnabled) {
      const [memberCount, inviteCount] = await Promise.all([
        prisma.familyMember.count({
          where: {
            familyId: currentFamilyId,
            userId: {
              not: dbUser.id,
            },
          },
        }),

        prisma.familyInvite.count({
          where: {
            familyId: currentFamilyId,
          },
        }),
      ]);

      if (memberCount > 0 || inviteCount > 0) {
        return NextResponse.json(
          {
            message:
              '参加中または招待中のメンバーがいるため、同期をOFFにできません。先にメンバー削除または招待の取り消しをしてください。',
          },
          { status: 400 },
        );
      }
    }

    const targetFamilyId = syncEnabled
      ? currentFamilyId //ON →　現在の共有状態維持
      : homeFamilyId; //OFF →　自分の元の世界に戻す

    await Promise.all([
      // family更新（必ず元のfamilyを使う）
      prisma.family.update({
        where: { id: currentFamilyId },
        data: { syncEnabled },
      }),

      // user更新
      prisma.user.update({
        where: { id: dbUser.id },
        data: {
          activeFamilyId: targetFamilyId,
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};
