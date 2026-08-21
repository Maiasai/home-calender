//買い物リスト　新規追加用

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { CreateShoppingItem } from './_types/CreateShoppingItem';

export const POST = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    const body: CreateShoppingItem = await request.json();

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'family not found' },
        { status: 404 },
      );
    }
    const minSortOrder = await prisma.shoppingItem.aggregate({
      _min: {
        sortOrder: true, //ここでDBに今ある最小sortOrderを取得
      },
      where: {
        familyId: dbUser.activeFamilyId,
      },
    });

    const data = await prisma.shoppingItem.create({
      data: {
        familyId: dbUser.activeFamilyId,
        userId: user.id,
        name: body.name.trim(),
        quantityText: body.quantityText ?? 1,
        checked: false,
        unitId: body.unitId ?? null,
        itemType: body.itemType,

        //今DBにある一番小さいsortOrderを見て、その前の番号を付ける→create時に保存
        sortOrder: (minSortOrder._min.sortOrder ?? -1) - 1, //ソート番号を付与
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};
