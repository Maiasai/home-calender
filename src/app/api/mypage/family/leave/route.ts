//参加メンバーから抜けるAPI
import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { LeaveMemberType } from './_typs/leaveMemberType';

export const DELETE = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);
    const body: LeaveMemberType = await request.json();
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
    if (!dbUser?.homeFamilyId) {
      return NextResponse.json(
        { message: 'home family is not set' },
        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      // ① FamilyMemberから削除
      await prisma.familyMember.delete({
        where: {
          id: body.id,
        },
      });

      // ② activeFamilyIdを自分のhomeFamilyIdへ戻す
      await prisma.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          activeFamilyId: dbUser.homeFamilyId,
        },
      });
    });

    return NextResponse.json({ message: 'Successful' }, { status: 200 });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
};
