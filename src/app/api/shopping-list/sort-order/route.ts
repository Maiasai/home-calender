//並び替え用API

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { SortItems } from './_types/SortItems';

export const PUT = async (request: NextRequest) => {
  try {
    const user = await requireUser();
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    const body: SortItems = await request.json();

    const updates = body.items;

    if (!dbUser) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    const familyId = dbUser.activeFamilyId;
    if (!familyId) {
      return NextResponse.json(
        { message: 'family not found' },
        { status: 404 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      //まだDBに送ってないクエリ（複数操作）をまとめる
      await Promise.all(
        updates.map((item) =>
          tx.shoppingItem.updateMany({
            where: {
              id: item.id,
              familyId: familyId,
            },
            data: {
              sortOrder: item.sortOrder,
            },
          }),
        ),
      );
      return true;
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};
