//URLからレシピ登録API

import { CreateRecipeByUrlRequest } from '@/app/(main)/recipes/_types/CreateRecipeByUrlRequest';
import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const user = await requireUser();
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    const body: CreateRecipeByUrlRequest = await request.json();

    //タイトル必須チェック
    if (!body.title) {
      return NextResponse.json(
        { message: 'タイトルは必須です' },
        { status: 400 },
      );
    }
    //URL必須チェック
    if (!body.sourceUrl) {
      return NextResponse.json({ message: 'URLは必須です' }, { status: 400 });
    }

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'family not found' },
        { status: 404 },
      );
    }

    const recipe = await prisma.recipe.create({
      data: {
        ownerUserId: user.id, // 作成者
        familyId: dbUser.activeFamilyId!, // 所属グループ

        title: body.title || 'URLレシピ',
        sourceType: 'URL',
        sourceUrl: body.sourceUrl,
        category: body.category || 'UNCLASSIFIED',
        memo: body.memo || null,
        servings: 1,
        updatedByUserId: user.id, // 最終更新者
      },
    });
    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: '登録失敗' }, { status: 500 });
  }
};
