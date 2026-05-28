//ニックネーム変更　API

import { NickNameType } from '@/app/(main)/mypage/nickname/_type/NickNameType';
import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const PUT = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);
    const body: NickNameType = await request.json();

    const nickname = body.nickname;

    if (!nickname) {
      return NextResponse.json(
        { message: 'ニックネームが不正です' },
        { status: 400 },
      );
    }

    const data = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        nickname: nickname,
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('PUT ERROR:', error);
    return NextResponse.json(
      { message: '更新に失敗しました' },
      { status: 500 },
    );
  }
};
