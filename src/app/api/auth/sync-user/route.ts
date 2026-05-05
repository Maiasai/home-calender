//ユーザーを自分のDBに登録するAPI

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const { id: userId, email, provider } = await req.json();

    await prisma.user.upsert({
      //id探してあれば→update、なければ→create
      where: { email },
      update: {
        id: userId,
        authProvider: provider === 'google' ? 'GOOGLE' : 'EMAIL',
      },
      create: {
        //なければ新規ユーザー作成
        id: userId, //← Supabaseのidをそのまま使うことでprismaとidの差異が出ないようにする
        email,
        authProvider: provider === 'google' ? 'GOOGLE' : 'EMAIL',
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('SYNC USER ERROR:', e);
    throw e;
  }
};
