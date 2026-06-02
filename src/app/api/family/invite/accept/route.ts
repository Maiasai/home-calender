//招待承認　API

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    //今ログインしている人を取得
    const user = await requireUser(request);
    const body = await request.json();

    const [dbUser, invite] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: user.id,
        },
      }),

      prisma.familyInvite.findUnique({
        where: {
          id: body.inviteId,
        },
      }),
    ]);

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'active family is not set' },
        { status: 400 },
      );
    }

    if (!invite) {
      return NextResponse.json(
        { message: 'この招待は取り消されています' },
        { status: 400 },
      );
    }

    if (invite.email !== dbUser.email) {
      return NextResponse.json(
        { message: 'この招待を承認する権限がありません' },
        { status: 403 },
      );
    }

    await prisma.$transaction([
      //招待元の人のfamilyMemberテーブルに、招待された人を所属追加
      prisma.familyMember.create({
        data: {
          userId: dbUser.id,
          familyId: invite.familyId,
        },
      }),

      //招待された側のactiveFamilyId変更
      prisma.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          activeFamilyId: invite.familyId,
        },
      }),

      //招待中テーブルから削除
      prisma.familyInvite.delete({
        where: {
          id: invite.id,
        },
      }),
    ]);
    return NextResponse.json(
      { message: 'Successful participation' },
      { status: 200 },
    );
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
};
