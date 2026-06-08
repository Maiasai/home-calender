//参加メンバーからメンバーを削除するAPI

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { MemberId } from './_typs/MemberId';

export const DELETE = async (request: NextRequest) => {
  try {
    const user = await requireUser(request); //今操作してる人（user.id→オーナー）
    const memberId: MemberId = await request.json(); //memberId→削除したいメンバー取得

    const [dbUser, member] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: user.id,
        },
      }),

      prisma.familyMember.findUnique({
        where: {
          id: memberId.id,
        },
        include: {
          user: true,
        },
      }),
    ]);

    if (!member?.user.homeFamilyId) {
      return NextResponse.json(
        { message: '対象ユーザーの homeFamilyId がありません' },
        { status: 400 },
      );
    }
    if (!dbUser?.homeFamilyId) {
      return NextResponse.json(
        { message: 'home family is not set' },
        { status: 400 },
      );
    }

    if (!member) {
      return NextResponse.json(
        { message: '削除対象のメンバーが見つかりません' },
        { status: 400 },
      );
    }
    if (member.familyId !== dbUser.activeFamilyId) {
      return NextResponse.json(
        { message: '権限がありません' },
        { status: 403 },
      );
    }

    await prisma.$transaction(async (tx) => {
      // FamilyMemberから削除
      await tx.familyMember.delete({
        where: {
          id: member.id,
        },
      });

      //  activeFamilyIdを自分のhomeFamilyIdへ戻す
      await tx.user.update({
        where: {
          id: member.userId,
        },
        data: {
          activeFamilyId: member.user.homeFamilyId,
        },
      });
    });

    return NextResponse.json({ message: 'Successful' }, { status: 200 });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};
