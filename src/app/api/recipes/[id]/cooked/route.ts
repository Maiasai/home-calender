//作ったもの登録API

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface CookedRequestBody {
  hasCooked: boolean;
}

export const PATCH = async (
  //PATCHは一部だけ更新
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const user = await requireUser(request);
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'family not found' },
        { status: 404 },
      );
    }

    const body: CookedRequestBody = await request.json(); //フロントからきたデータを読む
    const { hasCooked } = body;
    const recipeId = params.id; //レシピidは引数からやってきたものを使用

    const result = await prisma.familyRecipeStatus.upsert({
      //upsert→存在すればupdate、なければcreate
      where: {
        familyId_recipeId: {
          //familyIdとrecipeIdの組み合わせで探す
          familyId: dbUser.activeFamilyId,
          recipeId: recipeId,
        },
      },
      update: {
        //データがあったらお気に入りを更新
        hasCooked: hasCooked,
      },
      create: {
        //データがなければ新規作成
        familyId: dbUser.activeFamilyId,
        recipeId: recipeId,
        hasCooked: hasCooked,
      },
    });
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ message: '失敗しました' }, { status: 500 });
  }
};
