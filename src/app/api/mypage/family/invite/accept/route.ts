//招待承認　API

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    //今ログインしている人を取得
    const user = await requireUser(request);
    const body = await request.json();

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
    const invite = await prisma.familyInvite.findUnique({
      where: {
        id: body.inviteId,
      },
    });
    if (!invite || invite.email !== dbUser.email) {
      return NextResponse.json({ message: 'invalid invite' }, { status: 403 });
    }

    if (!invite) {
      return NextResponse.json(
        { message: 'invite not found' },
        { status: 400 },
      );
    }
    //招待元の人のfamilyMemberテーブルに、招待された人を所属追加
    await prisma.familyMember.create({
      data: {
        userId: dbUser.id,
        familyId: invite.familyId,
      },
    });

    //招待された側のactiveFamilyId変更
    const data = await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: {
        activeFamilyId: invite.familyId,
      },
    });

    await prisma.familyInvite.update({
      where: {
        id: invite.id,
      },
      data: {
        status: 'ACCEPTED',
      },
    });
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
