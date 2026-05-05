//献立カレンダー取得用　API

import { ItemType } from '@/app/(main)/home/_typs/Menu';
import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url); //URLを分解
    const month = searchParams.get('month'); //クエリから値を取り出す

    if (!month) {
      //nullを排除
      return NextResponse.json({ message: 'monthが必要です' }, { status: 400 });
    }
    // 2026-04 → 年月取得
    const [year, monthNum] = month.split('-').map(Number);

    const start = `${year}-${String(monthNum).padStart(2, '0')}-01`;

    const end =
      monthNum === 12
        ? `${year + 1}-01-01`
        : `${year}-${String(monthNum + 1).padStart(2, '0')}-01`;

    const menus = await prisma.menu.findMany({
      where: {
        userId: user.id,
        date: {
          gte: start, //以上
          lt: end, //未満(月末日を直接計算しないため)
        },
      },
      include: {
        menuRecipes: {
          include: {
            recipe: {
              include: {
                recipeIngredients: {
                  include: {
                    ingredient: true,
                    unit: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    //朝昼晩に仕分け
    const result: Record<
      //Record<キーの型, 値の型>※文字列キーを持ってて、中身は朝昼晩の配列を持つオブジェクト
      string, //← (例)"2026-04-15"
      {
        id: string;
        breakfast: ItemType[];
        lunch: ItemType[];
        dinner: ItemType[];
      }
    > = {}; //初期値（空の箱からスタート）

    for (const menu of menus) {
      //menusの中身は１日ずつのデータのオブジェクト→それが一つずつ入ってきてる
      //①menu.date→Date型→toISOString()で文字列に変換
      //②split('T')→日付と時間を分ける["2026-04-15", "00:00:00.000Z"]
      //③ [0]→"2026-04-15"
      const dateKey = menu.date;

      if (!result[dateKey]) {
        //その日付の箱があるか確認→なければ作る
        result[dateKey] = {
          id: menu.id,
          breakfast: [],
          lunch: [],
          dinner: [],
        };
      }

      for (const item of menu.menuRecipes) {
        //その日のレシピを全部
        const data = {
          //フロントで必要なものだけを整形
          id: item.recipe.id,
          title: item.recipe.title,
          thumbnailUrl: item.recipe.thumbnailUrl,
          ingredients: item.recipe.recipeIngredients.map((ri) => ({
            id: ri.ingredient.id,
            name: ri.ingredient.name,
            amount: ri.quantityText,
            unit: ri.unit.name,
          })),
        };

        if (item.mealType === 'BREAKFAST') {
          result[dateKey].breakfast.push(data);
        }
        if (item.mealType === 'LUNCH') {
          result[dateKey].lunch.push(data);
        }
        if (item.mealType === 'DINNER') {
          result[dateKey].dinner.push(data);
        }
      }
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
};
