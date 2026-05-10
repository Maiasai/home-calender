//保存されている買い物リストを取得するAPI

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ShoppingItemResponse } from './_types/ShoppingItemResponse';
import { UpdateShoppingData } from './_types/UpdateShoppingData';

export const GET = async () => {
  try {
    const user = await requireUser();
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'family not found' },
        { status: 400 },
      );
    }

    const result = await prisma.shoppingItem.findMany({
      where: {
        familyId: dbUser.activeFamilyId,
      },
      include: {
        unit: true,
      },
      orderBy: [
        { checked: 'asc' }, //未チェック優先
        { sortOrder: 'asc' },
      ],
    });

    const formatted: ShoppingItemResponse[] = result.map((item) => ({
      id: item.id,
      name: item.name,
      quantityText: item.quantityText ?? 0,
      unitId: item.unitId ?? null,
      checked: item.checked,
      sortOrder: item.sortOrder,
      memo: item.memo ?? null,
      unit: item.unit ?? null,
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
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    const body: shoppingData = await request.json();

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'family not found' },
        { status: 400 },
      );
    }

    const mealData = await prisma.menu.findFirst({
      where: {
        familyId: dbUser.activeFamilyId,
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
                        id: true,
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

    let globalIndex = 0;

    console.dir(mealData, { depth: null });
    const data = mealData.menuRecipes.flatMap((item) =>
      item.recipe.recipeIngredients
        .filter((ing) => ing.ingredient?.name?.trim())
        .map((ing) => ({
          userId: user.id,
          name: ing.ingredient?.name ?? null,
          quantityText: ing.quantityText ?? 0,
          unitId: ing.unit?.id ?? null,
          sortOrder: globalIndex++,
        })),
    );

    for (const item of data) {
      const existing = await prisma.shoppingItem.findFirst({
        where: {
          userId: user.id,
          name: item.name.trim(),
          unitId: item.unitId,
        },
      });

      if (existing) {
        await prisma.shoppingItem.update({
          where: {
            id: existing.id,
          },

          data: {
            quantityText:
              (existing.quantityText ?? 0) + (item.quantityText ?? 0),
          },
        });
      } else {
        await prisma.shoppingItem.create({
          data: {
            ...item,
            familyId: dbUser.activeFamilyId,
          },
        });
      }
    }

    return NextResponse.json(
      { message: '買い物リスト追加完了' },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
  }
};

//買い物リスト更新

export const PUT = async (request: NextRequest) => {
  try {
    const user = await requireUser();
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    const body: UpdateShoppingData = await request.json();

    console.log('body', body);
    if (!body.id) {
      return NextResponse.json({ message: 'idが必要です' }, { status: 400 });
    }

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'family not found' },
        { status: 400 },
      );
    }

    //送られた項目だけを更新
    const updateData = {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.quantityText !== undefined && {
        quantityText: body.quantityText,
      }),
      ...(body.unitId !== undefined && {
        unitId: body.unitId,
      }),
      ...(body.memo !== undefined && {
        memo: body.memo,
      }),
      ...(body.checked !== undefined && {
        checked: body.checked,
      }),
    };

    const result = await prisma.shoppingItem.updateMany({
      where: {
        id: body.id,
        familyId: dbUser.activeFamilyId,
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
  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });
  const body = await request.json();

  if (!dbUser?.activeFamilyId) {
    return NextResponse.json({ message: 'family not found' }, { status: 400 });
  }

  try {
    const result = await prisma.shoppingItem.deleteMany({
      where: { id: body.id, familyId: dbUser.activeFamilyId },
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
  }
};
