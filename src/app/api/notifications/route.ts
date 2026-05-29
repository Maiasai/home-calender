//通知取得API

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

    const data = await prisma.familyInvite.findMany({
      where: {
        email: dbUser.email,
        status: 'PENDING',
      },
      include: {
        family: true,
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
};
