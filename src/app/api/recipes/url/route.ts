//URLからレシピ登録API

import { CreateRecipeByUrlRequest } from '@/app/(main)/recipes/_types/CreateRecipeByUrlRequest';
import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);
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
    const recipeCount = await prisma.recipe.count({
      where: {
        familyId: dbUser.activeFamilyId,
      },
    });
    if (recipeCount >= 150) {
      return NextResponse.json(
        { message: 'レシピは150件まで登録できます' },
        { status: 400 },
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

    const ingredients = body.ingredients;

    if (ingredients) {
      for (let index = 0; index < ingredients.length; index++) {
        const ingre = ingredients[index];
        const displayName = ingre.name?.trim();
        const normalizedName = displayName?.toLowerCase();

        if (!displayName || !normalizedName) continue;
        const amount =
          typeof ingre.amount === 'number' && !Number.isNaN(ingre.amount) //ingre.amount が NaN じゃないか確認
            ? ingre.amount
            : null;

        const unitId = ingre.unitId?.trim() || null;

        await prisma.recipeIngredient.create({
          data: {
            quantityText: amount,
            sortOrder: index,
            //ここで先に作ったレシピに繋ぐ
            recipe: {
              connect: {
                id: recipe.id,
              },
            },
            //食材名と繋ぐ部分(入ってきた材料が同じ家族のid内にあるか)
            ingredient: {
              connectOrCreate: {
                where: {
                  familyId_normalizedName: {
                    familyId: dbUser.activeFamilyId,
                    normalizedName,
                  },
                },
                create: {
                  familyId: dbUser.activeFamilyId,
                  name: displayName,
                  normalizedName,
                },
              },
            },
            unit: unitId
              ? {
                  connect: {
                    id: unitId,
                  },
                }
              : undefined,
          },
        });
      }
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};
