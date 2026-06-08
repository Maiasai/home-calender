//ユーザーを自分のDBに登録するAPI

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const { id: userId, email, provider } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (existingUser) {
      // 既存ユーザーは「更新しない or nicknameだけ」
      await prisma.user.update({
        where: { id: userId },
        data: {
          email,
        },
      });
      return NextResponse.json({ ok: true });
    }
    // 新規のみ作る
    await prisma.$transaction(async (tx) => {
      // ① User作成
      await tx.user.create({
        data: {
          id: userId,
          email,
          authProvider: provider === 'google' ? 'GOOGLE' : 'EMAIL',
        },
      });

      // ② family作成
      const family = await tx.family.create({
        data: {
          ownerUserId: userId,
        },
      });

      // ③ user更新
      await Promise.all([
        tx.user.update({
          where: { id: userId },
          data: {
            activeFamilyId: family.id,
            homeFamilyId: family.id,
          },
        }),

        // ④ member作成
        tx.familyMember.create({
          data: {
            userId,
            familyId: family.id,
          },
        }),
      ]);
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};
