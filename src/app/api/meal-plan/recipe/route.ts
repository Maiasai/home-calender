//献立個別削除用API

import { DeleteMealRecipeBody } from '@/app/(main)/home/_typs/MealId';
import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);
    const body: DeleteMealRecipeBody = await request.json();
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        activeFamilyId: true,
      },
    });
    const familyId = dbUser?.activeFamilyId;

    if (!familyId) {
      return NextResponse.json(
        { message: 'family not found' },
        { status: 404 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      //削除対象のmenuRecipeから親のmenuIdを探す
      const mealRecipe = await tx.menuRecipe.findFirst({
        where: {
          id: body.id,
          menu: {
            familyId,
          },
        },
        select: {
          menuId: true, //献立箱MenuのID
        },
      });
      if (mealRecipe === null) {
        return null;
      }

      const deleteResult = await tx.menuRecipe.deleteMany({
        where: {
          id: body.id,
          menu: {
            familyId,
          },
        },
      });

      //同じmenuidに紐づくmenuRecipeの残数を数える
      const remainingCount = await tx.menuRecipe.count({
        //countは単なる数値
        where: {
          menuId: mealRecipe.menuId,
        },
      });
      //空箱なら親Menuも削除
      if (remainingCount === 0) {
        await tx.menu.deleteMany({
          where: {
            id: mealRecipe.menuId,
            familyId,
          },
        });
      }
      return deleteResult;
    });
    if (result === null) {
      return NextResponse.json(
        { message: '対象の献立idが見つかりません' },
        { status: 404 },
      );
    }
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};
