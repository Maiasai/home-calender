//アカウント新規登録API
import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AuthProvider } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { NicknameData } from '@/app/login/_typs/NicknameData';

export const POST = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);
    const body: NicknameData = await request.json();

    const { nickname } = body;

    if (!nickname || typeof nickname !== 'string') {
      return NextResponse.json(
        { message: 'invalid nickname' },
        { status: 400 },
      );
    }

    const rawProvider = user.app_metadata?.provider;

    const provider: AuthProvider =
      rawProvider?.toLowerCase() === 'google' ? 'GOOGLE' : 'EMAIL';

    if (!user.email) {
      throw new Error('email is required');
    }

    await prisma.$transaction(async (tx) => {
      const userRecord = await tx.user.upsert({
        where: { id: user.id },
        update: { nickname },
        create: {
          id: user.id,
          email: user.email ?? '',
          nickname,
          authProvider: provider,
        },
      });

      const family = await tx.family.create({
        data: {
          ownerUserId: userRecord.id,
        },
      });

      await tx.user.update({
        where: {
          id: user.id,
        },

        data: {
          activeFamilyId: family.id,
          homeFamilyId: family.id,
        },
      });

      await tx.familyMember.create({
        data: {
          userId: user.id,
          familyId: family.id,
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: String(error) }, { status: 500 });
  }
};
