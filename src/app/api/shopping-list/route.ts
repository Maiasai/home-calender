//保存されている買い物リストを取得するAPI

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export type ShoppingItemResponse = {
  id: string;
  name: string;
  quantityText: number;
  unitName: string;
  checked: boolean;
  sortOrder: number;
  memo?: string;
};
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
        sortOrder: true,
        memo: true,
      },
      orderBy: [
        { checked: 'asc' }, //未チェック優先
        { updatedAt: 'asc' },
      ],
    });

    const formatted: ShoppingItemResponse[] = result.map((item) => ({
      id: item.id,
      name: item.name,
      quantityText: item.quantityText ?? 0,
      unitName: item.unitName ?? '',
      checked: item.checked,
      sortOrder: item.sortOrder,
      memo: item.memo ?? undefined,
    }));

    return NextResponse.json(formatted, { status: 200 });
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

//買い物リスト更新

type UpdateShoppingData = {
  id: string;
  name?: string;
  quantityText?: number;
  unitName?: string;
  memo?: string;
};

export const PUT = async (request: NextRequest) => {
  try {
    const user = await requireUser();
    const body: UpdateShoppingData = await request.json();

    if (!body.id) {
      return NextResponse.json({ message: 'idが必要です' }, { status: 400 });
    }

    // 自分の買い物リストか確認
    const target = await prisma.shoppingItem.findFirst({
      where: {
        id: body.id,
        userId: user.id,
      },
    });

    if (!target) {
      return NextResponse.json(
        { message: 'データが見つかりません' },
        { status: 404 },
      );
    }

    const updateData = {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.quantityText !== undefined && {
        quantityText: body.quantityText,
      }),
      ...(body.unitName !== undefined && {
        unitName: body.unitName,
      }),
      ...(body.memo !== undefined && {
        memo: body.memo,
      }),
    };

    const result = await prisma.shoppingItem.update({
      where: {
        id: body.id,
      },
      data: updateData,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
  }
};

//削除
export const DELETE = async (request: NextRequest) => {
  const user = await requireUser();
  const body = await request.json();

  try {
    const result = await prisma.shoppingItem.delete({
      where: { id: body.id },
    });
  } catch (error) {
    console.log(error);
  }
};
