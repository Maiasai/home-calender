//作ったもの登録API

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface CoockedRequestBody {
  hasCooked: boolean;
}

export const PATCH = async (
  //PATCHは一部だけ更新
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const user = await requireUser();

    const body: CoockedRequestBody = await request.json(); //フロントからきたデータを読む
    const { hasCooked } = body;
    const recipeId = params.id; //レシピidは引数からやってきたものを使用

    const result = await prisma.userRecipeStatus.upsert({
      //upsert→存在すればupdate、なければcreate
      where: {
        userId_recipeId: {
          //userIdとrecipeIdの組み合わせで探す
          userId: user.id,
          recipeId: recipeId,
        },
      },
      update: {
        //データがあったらお気に入りを更新
        hasCooked: hasCooked,
      },
      create: {
        //データがなければ新規作成
        userId: user.id,
        recipeId: recipeId,
        hasCooked: hasCooked,
      },
    });
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ message: '失敗しました' }, { status: 500 });
  }
};
