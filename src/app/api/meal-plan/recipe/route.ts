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
    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'family not found' },
        { status: 404 },
      );
    }
    const result = await prisma.menuRecipe.deleteMany({
      where: {
        id: body.id,
        menu: {
          familyId: dbUser.activeFamilyId,
        },
      },
    });
    if (result.count === 0) {
      return NextResponse.json(
        { message: '削除対象の献立が見つかりません' },
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
