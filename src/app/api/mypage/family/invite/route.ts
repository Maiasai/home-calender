//共有設定　メンバー招待用
//フロントからemail受け取り既存メンバー/inviteかチェック→FamilyInvite作成（PENDING）→メール送信

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { EmailInviteType } from '@/app/(main)/mypage/share/_type/EmailInviteType';

export const POST = async (request: NextRequest) => {
  try {
    const user = await requireUser(request); //操作者
    const body: EmailInviteType = await request.json();

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

    const familyId = dbUser.activeFamilyId; //招待先 family

    for (const inviteData of body.invites) {
      const email = inviteData.email;

      // ① 既存メンバーチェック
      const existingMember = await prisma.familyMember.findFirst({
        where: { familyId, user: { email } },
      });
      if (existingMember) {
        return NextResponse.json(
          { message: 'already a member' },

          { status: 400 },
        );
      }

      // ② 既存招待チェック
      const existingInvite = await prisma.familyInvite.findFirst({
        where: { familyId, email },
      });

      if (existingInvite) {
        return NextResponse.json(
          { message: 'already invited' },

          { status: 400 },
        );
      }

      // ③ 招待作成
      const invite = await prisma.familyInvite.create({
        data: {
          familyId: familyId,
          email: email, //招待相手
          status: 'PENDING',
        },
      });
    }

    return NextResponse.json({ message: 'invite created' }, { status: 200 });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
};
