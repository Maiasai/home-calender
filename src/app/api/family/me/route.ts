//共有設定　オーナー情報　取得用

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { OwnerType } from './_type/OwnerType';

export const GET = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!dbUser) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'active family is not set' },
        { status: 400 },
      );
    }

    const family = await prisma.family.findUnique({
      where: {
        id: dbUser.activeFamilyId,
      },
      include: {
        owner: true,
      },
    });

    if (!family) {
      return NextResponse.json(
        { message: 'family is not found' },
        { status: 400 },
      );
    }
    const formatted: OwnerType = {
      nickname: family.owner.nickname ?? '',
      id: family.owner.id,
      syncEnabled: family.syncEnabled,
    };

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};

//参加メンバー削除API
export const DELETE = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);

    const body = await request.json();

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

    const memberId = body.id;

    if (!memberId) {
      return NextResponse.json(
        { message: '削除するメンバーが指定されていません' },

        { status: 400 },
      );
    }

    // 削除対象のfamilyMemberを取得

    const targetMember = await prisma.familyMember.findUnique({
      where: {
        id: memberId,
      },

      include: {
        user: true,

        family: true,
      },
    });

    if (!targetMember) {
      return NextResponse.json(
        { message: 'メンバーが見つかりませんでした' },

        { status: 404 },
      );
    }

    // 自分が今見ているグループ以外のメンバーは削除できない

    if (targetMember.familyId !== dbUser.activeFamilyId) {
      return NextResponse.json(
        { message: 'このメンバーを削除する権限がありません' },

        { status: 403 },
      );
    }

    // オーナー本人だけが削除できる

    if (targetMember.family.ownerUserId !== dbUser.id) {
      return NextResponse.json(
        { message: 'メンバーを削除できるのはオーナーのみです' },

        { status: 403 },
      );
    }

    // 自分自身は削除できない

    if (targetMember.userId === dbUser.id) {
      return NextResponse.json(
        { message: '自分自身は削除できません' },

        { status: 400 },
      );
    }

    // オーナーは削除できない

    if (targetMember.userId === targetMember.family.ownerUserId) {
      return NextResponse.json(
        { message: 'オーナーは削除できません' },

        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      // ① FamilyMemberから削除

      await tx.familyMember.delete({
        where: {
          id: targetMember.id,
        },
      });

      // ② 招待中データが残っていたら削除

      await tx.familyInvite.deleteMany({
        where: {
          familyId: targetMember.familyId,

          email: targetMember.user.email,
        },
      });

      // ③ 削除された人がそのグループを表示中なら、自分のhomeFamilyIdへ戻す

      if (targetMember.user.activeFamilyId === targetMember.familyId) {
        await tx.user.update({
          where: {
            id: targetMember.userId,
          },

          data: {
            activeFamilyId: targetMember.user.homeFamilyId,
          },
        });
      }
    });

    return NextResponse.json(
      { message: 'メンバーを削除しました' },

      { status: 200 },
    );
  } catch (error) {
    console.log('error', error);

    return NextResponse.json(
      { message: 'エラーが発生しました' },

      { status: 500 },
    );
  }
};
