//共有設定　メンバー招待用
//フロントからemail受け取り既存メンバー/inviteかチェック→FamilyInvite作成（PENDING）→メール送信

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { EmailInviteType } from '@/app/(main)/mypage/share/_type/EmailInviteType';
import { DeleteInviteRequest } from './_type/DeleteInviteRequest';

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

      // ①登録済みユーザー確認
      const targetUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!targetUser) {
        return NextResponse.json(
          { message: '登録済みユーザーのみ招待できます' },
          { status: 400 },
        );
      }

      // ② 既存メンバーチェック
      const [existingMember, existingInvite] = await Promise.all([
        prisma.familyMember.findFirst({
          where: { familyId, user: { email } },
        }),

        // ③ 既存招待チェック
        prisma.familyInvite.findFirst({
          where: { familyId, email },
        }),
      ]);

      if (existingMember) {
        return NextResponse.json(
          { message: '既に参加済みのメンバーです' },
          { status: 400 },
        );
      }

      if (existingInvite) {
        return NextResponse.json(
          { message: '既に招待済みのメンバーです' },
          { status: 400 },
        );
      }

      // ④ 招待作成
      await prisma.familyInvite.create({
        data: {
          familyId: familyId,
          email: email, //招待相手
        },
      });
    }

    return NextResponse.json({ message: 'invite created' }, { status: 200 });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};

//招待キャンセル

export const DELETE = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);
    const body: DeleteInviteRequest = await request.json();

    const [dbUser, invite] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: user.id,
        },
      }),

      prisma.familyInvite.findUnique({
        where: {
          id: body.id,
        },
      }),
    ]);

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'active family is not set' },
        { status: 400 },
      );
    }

    if (!invite) {
      return NextResponse.json(
        { message: '招待が見つかりません' },
        { status: 404 },
      );
    }

    //オーナーか判定
    const isOwner = invite.familyId === dbUser.activeFamilyId;

    //招待された本人かどうか判定
    const isInvitee = invite.email === dbUser.email;

    //オーナーが取り消し
    if (isOwner) {
      await prisma.familyInvite.delete({
        where: {
          id: invite.id,
        },
      });
      return NextResponse.json(
        { message: '招待を取り消しました' },
        { status: 200 },
      );
    }

    //招待された側が辞退
    if (isInvitee) {
      await prisma.familyInvite.delete({
        where: {
          id: invite.id,
        },
      });
      return NextResponse.json(
        { message: '招待を辞退しました' },
        { status: 200 },
      );
    }

    if (!isOwner && !isInvitee) {
      return NextResponse.json(
        { message: '権限がありません' },
        { status: 403 },
      );
    }

    return NextResponse.json({ message: 'invite deleated' }, { status: 200 });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};
