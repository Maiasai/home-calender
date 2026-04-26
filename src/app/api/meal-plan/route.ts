//献立API

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MealType } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { MealRequestBodyEdit } from '@/app/(main)/home/_typs/MealRequestBodyEdit';

//献立取得
export const GET = async (request: NextRequest) => {
  try {
    const user = await requireUser();
    const userId = user.id;

    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json(
        { message: 'startとendは必須です' },
        { status: 400 },
      );
    }

    const mealdata = await prisma.menu.findMany({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        menuRecipes: {
          include: {
            recipe: true, //リレーション
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(mealdata, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'error' }, { status: 500 });
  }
};

//献立新規作成

type RequestBody = {
  date: string; // ← JSON では string になるので string
  recipes: {
    recipeId: string;
    mealType: MealType;
    position?: number;
  }[];
};

export const POST = async (request: NextRequest) => {
  try {
    const user = await requireUser(); //ここでユーザーを特定している
    const userId = user.id;

    const body: RequestBody = await request.json();
    const { date, recipes } = body;

    const mealplan = await prisma.menu.create({
      data: {
        //dataは　CREATE/UPDATE用
        userId,
        date: date,
        menuRecipes: {
          create: recipes.map((r) => ({
            mealType: r.mealType,
            position: r.position,
            recipe: {
              connect: {
                id: r.recipeId,
              },
            },
          })),
        },
      },
    });
    return NextResponse.json(mealplan, { status: 200 });
  } catch (error) {
    console.error('API ERROR:', error);

    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
};

//献立更新API
export const PUT = async (request: NextRequest) => {
  try {
    const user = await requireUser();
    const body: MealRequestBodyEdit = await request.json();

    const exists = await prisma.menu.findFirst({
      where: {
        id: body.id,
        userId: user.id,
      },
    });

    if (!exists) {
      return NextResponse.json(
        { message: '権限がありません' },
        { status: 403 },
      );
    }

    const data = await prisma.menuRecipe.deleteMany({
      where: { menuId: body.id },
    });

    const newdata = await prisma.menuRecipe.createMany({
      data: body.recipes.map((r) => ({
        menuId: body.id,
        recipeId: r.recipeId,
        mealType: r.mealType,
        position: r.position,
      })),
    });
    return NextResponse.json(newdata, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
  }
};

//献立削除API

export const DELETE = async (request: NextRequest) => {
  try {
    const user = await requireUser();
    const body = await request.json();

    const result = await prisma.menu.deleteMany({
      where: {
        id: body.id,
        userId: user.id,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
  }
};
