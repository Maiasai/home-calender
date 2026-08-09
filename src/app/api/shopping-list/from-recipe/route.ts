//レシピ詳細から買い物リストへ追加用API

import { ShopAddBodyType } from '@/app/(main)/recipes/_types/RecipeDetail';
import requireUser from '@/lib/auth';
import { createNotification } from '@/lib/notification';
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
    const body: ShopAddBodyType = await request.json();

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'family not found' },
        { status: 404 },
      );
    }
    const familyId = dbUser.activeFamilyId;

    await Promise.all(
      body.ingredient.map(async (item) => {
        const ingredientItems = await prisma.shoppingItem.findMany({
          where: {
            userId: user.id,
            familyId,
            name: item.name.trim(),
            unitId: item.unitId ?? null,
            itemType: 'ITEM',
          },
          orderBy: {
            sortOrder: 'asc',
          },
        });

        if (ingredientItems.length === 0) {
          await prisma.shoppingItem.create({
            data: {
              ...item,
              userId: user.id,
              familyId: familyId,
            },
          });
          return;
        }
        const representative = ingredientItems[0];

        const existingTotal = ingredientItems.reduce(
          (sum, ingredientItems) => sum + (ingredientItems.quantityText ?? 0),
          0,
        );

        const duplicateIds = ingredientItems
          .slice(1)
          .map((ingredientItem) => ingredientItem.id);

        await prisma.$transaction([
          prisma.shoppingItem.update({
            where: {
              id: representative.id,
            },
            data: {
              quantityText: existingTotal + (item.quantityText ?? 0),
            },
          }),
          prisma.shoppingItem.deleteMany({
            where: {
              id: {
                in: duplicateIds,
              },
              familyId,
            },
          }),
        ]);
      }),
    );
    await createNotification({
      familyId: dbUser.activeFamilyId,
      actorUserId: user.id,
      type: 'SHOPPING_CREATED',
    });
    return NextResponse.json(
      { message: '買い物リスト追加完了' },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};
