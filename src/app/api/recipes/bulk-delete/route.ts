//一括削除用API

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { ApiOkResponse } from '../../_types/ApiOkResponse';

export async function POST(req: Request) {
  try {
    //フロントで fetch した際の selectedIds が ids としてサーバーに届く
    const { ids } = await req.json(); // string[]が期待

    // 外部キー制約に引っかからないように、まず関連テーブルを削除
    // deleteMany + whereで配列のIDに該当する全レコードを削除
    await prisma.userRecipeStatus.deleteMany({
      where: { recipeId: { in: ids } },
    });

    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: { in: ids } },
    });

    await prisma.recipeStep.deleteMany({
      where: { recipeId: { in: ids } },
    });

    // 最後に Recipe を削除
    await prisma.recipe.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json<ApiOkResponse>({ ok: true });
  } catch (err) {
    console.error('bulk delete error:', err);

    return NextResponse.json(
      { message: 'Internal server error', error: err },
      { status: 500 },
    );
  }
}
