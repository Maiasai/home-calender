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

    const results = await Promise.all(
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
        return {
          item,
          ingredientItems,
          isNew: ingredientItems.length === 0,
        };
      }),
    );
    const newItems = results
      .filter((result) => result.isNew)
      .map((result) => result.item);

    const updateTargets = results.filter((result) => !result.isNew);
    const newItemCount = newItems.length;

    await prisma.shoppingItem.updateMany({
      where: {
        familyId,
      },
      data: {
        sortOrder: {
          increment: newItemCount,
        },
      },
    });

    await Promise.all(
      newItems.map((item, index) =>
        prisma.shoppingItem.create({
          data: {
            ...item,
            userId: user.id,
            familyId,
            sortOrder: index,
          },
        }),
      ),
    );

    await Promise.all(
      updateTargets.map(async (updateItem) => {
        //ingredientItems＝フロントと重複してたDB側のデータ
        const ingredientItems = updateItem.ingredientItems;

        const representative = ingredientItems[0];

        const existingTotal = ingredientItems.reduce(
          (sum, item) => sum + (item.quantityText ?? 0),
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
              //ここでDB側のデータとフロントから来たデータitemの数量を合算
              quantityText: existingTotal + (updateItem.item.quantityText ?? 0),
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
