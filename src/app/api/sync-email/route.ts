//ログイン中ユーザー取得→body.email受け取る→Prisma users.email 更新 API

import { InputEmailData } from '@/app/login/_typs/InputEmailData';
import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const PUT = async (request: NextRequest) => {
  try {
    const user = await requireUser();
    const body: InputEmailData = await request.json();

    const result = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: body.email,
      },
    });

    return NextResponse.json({ message: 'email sync ok' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
  }
};
