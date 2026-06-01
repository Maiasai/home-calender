//共有設定　オーナー情報　取得用

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { OwnerType } from './_type/OwnerType';

export const GET = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!dbUser) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'active family is not set' },
        { status: 400 },
      );
    }

    const family = await prisma.family.findUnique({
      where: {
        id: dbUser.activeFamilyId,
      },
      include: {
        owner: true,
      },
    });

    if (!family) {
      return NextResponse.json(
        { message: 'family is not found' },
        { status: 400 },
      );
    }
    const formatted: OwnerType = {
      nickname: family.owner.nickname ?? '',
      id: family.owner.id,
      syncEnabled: family.syncEnabled,
    };

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
};
