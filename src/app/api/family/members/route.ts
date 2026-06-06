//共有設定　参加済みメンバー取得用
//familyId→レコードが属している家族グループ（例：献立や買い物リスト、レシピの所属先）
//activeFamilyId→今ユーザーが見ている家族（表示状態）

import requireUser from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MembersTyps } from '../_typs/MembersTyps';

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

    const members = await prisma.familyMember.findMany({
      where: {
        familyId: familyId, //今見てる家族に紐づけて取得する
      },
      include: {
        user: true,
      },
    });

    const formatted: MembersTyps[] = members.map((m) => ({
      id: m.id,
      userId: m.userId,
      nickname: m.user.nickname ?? '',
      email: m.user.email,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};

//参加メンバーから抜けるAPI

export const DELETE = async (request: NextRequest) => {
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
    if (!dbUser?.homeFamilyId) {
      return NextResponse.json(
        { message: 'home family is not set' },
        { status: 400 },
      );
    }

    //自分のfamilyMemberテーブル取得
    const member = await prisma.familyMember.findFirst({
      where: {
        userId: dbUser.id,
        familyId: dbUser.activeFamilyId,
      },
    });

    if (!member) {
      return NextResponse.json(
        { message: 'メンバーが見つかりませんでした' },
        { status: 404 },
      );
    }

    await prisma.$transaction(async (tx) => {
      // ① FamilyMemberから削除
      await tx.familyMember.delete({
        where: {
          id: member.id,
        },
      });

      // ② FamilyMemberから削除
      await tx.familyInvite.deleteMany({
        where: {
          familyId: member.familyId,
          email: dbUser.email,
        },
      });

      // ③ activeFamilyIdを自分のhomeFamilyIdへ戻す
      await tx.user.update({
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
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};
