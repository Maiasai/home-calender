//保存されている買い物リストを取得するAPI

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const user = await requireUser();

    const result = await prisma.shoppingItem.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        quantityText: true,
        unitName: true,
        checked: true,
      },
      orderBy: [
        { checked: 'asc' }, //未チェック優先
        { updatedAt: 'desc' }, //新しい順
      ],
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('エラー内容', error);
    return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
  }
};

//買い物リスト作成

type shoppingData = {
  id: string;
};

export const POST = async (request: NextRequest) => {
  try {
    const user = await requireUser();
    const body: shoppingData = await request.json();

    const mealData = await prisma.menu.findFirst({
      where: {
        userId: user.id,
        id: body.id,
      },
      include: {
        menuRecipes: {
          include: {
            recipe: {
              include: {
                recipeIngredients: {
                  select: {
                    quantityText: true,
                    unit: {
                      select: {
                        name: true,
                      },
                    },
                    ingredient: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!mealData) {
      return NextResponse.json(
        { message: '献立が見つかりません' },
        { status: 404 },
      );
    }

    const result = []; //箱を用意

    for (const item of mealData.menuRecipes) {
      for (const ing of item.recipe.recipeIngredients) {
        result.push({
          quantityText: ing.quantityText,
          ingredientName: ing.ingredient.name,
          unit: ing.unit.name,
        });
      }
    }

    const data = result.map((item) => ({
      userId: user.id,
      name: item.ingredientName,
      quantityText: item.quantityText,
      unitName: item.unit,
    }));

    const dataresult = await prisma.shoppingItem.createMany({
      data,
    });

    return NextResponse.json(dataresult, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
  }
};
