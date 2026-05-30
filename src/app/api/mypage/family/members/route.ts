//共有設定　参加済みメンバー取得用
//familyId→レコードが属している家族グループ（例：献立や買い物リスト、レシピの所属先）
//activeFamilyId→今ユーザーが見ている家族（表示状態）

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
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
      { message: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
};
