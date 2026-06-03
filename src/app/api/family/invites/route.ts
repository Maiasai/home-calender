//共有設定　招待済みメンバー取得用

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { InvitesType } from '../_typs/InvitesType';

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

    const familyId = dbUser.activeFamilyId;

    const invites = await prisma.familyInvite.findMany({
      where: {
        familyId: familyId,
      },
    });
    const formatted: InvitesType[] = invites.map((m) => ({
      id: m.id,
      email: m.email,
      createdAt: m.createdAt,
    }));
    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
};
