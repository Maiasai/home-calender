//ユーザー情報　取得API

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { UserResponseType } from './_typs/UserResponseType';

export const GET = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);
    const result = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        nickname: true,
        email: true,
        authProvider: true,
        activeFamilyId: true,
      },
    });

    if (!result) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    const response: UserResponseType = {
      nickname: result.nickname ?? null,
      email: result.email,
      authProvider: result.authProvider,
      activeFamilyId: result.activeFamilyId ?? null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log('エラー内容', error);
    return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
  }
};
