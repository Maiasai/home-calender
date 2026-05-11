//ユーザーを自分のDBに登録するAPI

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const { id: userId, email, provider } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await prisma.user.update({
        where: { email },
        data: {
          id: userId,
          authProvider: provider === 'google' ? 'GOOGLE' : 'EMAIL',
        },
      });
    } else {
      await prisma.$transaction(async (tx) => {
        // ① family作成
        const family = await tx.family.create({
          data: {
            name: 'My Family',
          },
        });

        // ② user作成
        await Promise.all([
          tx.user.create({
            data: {
              id: userId,
              email,
              authProvider: provider === 'google' ? 'GOOGLE' : 'EMAIL',
              activeFamilyId: family.id,
            },
          }),

          // ③ family member作成
          tx.familyMember.create({
            data: {
              userId,
              familyId: family.id,
            },
          }),
        ]);
      });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};
