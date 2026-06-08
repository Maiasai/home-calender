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
    const maxSortOrder = await prisma.shoppingItem.aggregate({
      _max: {
        sortOrder: true, //ここでDBに今ある最大sortOrderを取得
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

        //今DBにある一番大きいsortOrderを見て、その次の番号を付ける→create時に保存
        sortOrder: (maxSortOrder._max.sortOrder ?? -1) + 1, //ソート番号を付与
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
