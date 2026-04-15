//レシピ詳細取得API
//URLのidを受け取ってDBからその１件を探してJSONで返す

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Recipe, RecipeCategory, RecipeSourceType } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

//左辺→分割代入、右辺→型指定（idはstrigですと言ってるだけ）　　{params} : { params : {id:string}}
export const GET = async (
  request: NextRequest, //ここのGETやPOSTでAppRouterのAPIはHTTPメソッドを判断してる
  { params }: { params: { id: string } },
) => {
  //
  //DBから一件だけ取得する

  const user = await requireUser(); //認証チェック（関数コンポーネント）

  const recipe = await prisma.recipe.findUnique({
    //DBから一意なキーで一件だけ取得（ここでの型はRecipe | null）
    where: {
      //URLで渡されたidのレシピを探して（ここで条件を渡してる）
      id: params.id, //ここでidを指定
    },
    include: {
      //紐づく材料と手順もくっつけて
      recipeIngredients: {
        include: {
          ingredient: true, //→ここで材料名も取得
          unit: true, //単位もここで取得
        },
      },
      recipeSteps: true,
    },
  });

  if (!recipe) {
    //なかったら404返す=nullは返らない
    return NextResponse.json({ message: 'Recipe not found' }, { status: 404 });
  }

  return NextResponse.json(recipe, { status: 200 });
}; //フロントには
// recipeオブジェクトそのものが、こう返る　→ {"id":"...","title":"いちごのソテー","memo":"..."...}

//レシピ削除API（単体削除）

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const user = await requireUser(); //Supabaseが特定したログインユーザーがここに来る

  const result = await prisma.recipe.deleteMany({
    where: {
      //この2つの条件に一致するレコードだけ削除
      id: params.id,
      ownerUserId: user.id, //自分のデータだけ取る
    }, //そのデータの持ち主かをチェック
  });

  if (result.count === 0)
    return NextResponse.json({ message: '削除できません' }, { status: 404 });
  return NextResponse.json({ message: '削除しました' });
};

//レシピ編集API

//schema.prisma見ながらフロントから送られてくるものを型定義(フロントがどういう形で送ってくるかを想定)
interface CreatePutRequestBody {
  thumbnailImageUrl: string;
  title: string;
  category: RecipeCategory;
  sourceType: RecipeSourceType;

  servings: number;

  ingredients: {
    name: string;
    amount: number;
    unitId: string;
  }[];

  steps: {
    recipestep: string;
  }[];
  memo: string;
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const user = await requireUser();
    const body: CreatePutRequestBody = await request.json();

    const recipe = await prisma.recipe.update({
      where: {
        id: params.id, //URLから取得したレシピのID
        ownerUserId: user.id, // ← 自分のレシピだけで絞る
      },

      data: {
        title: body.title,
        memo: body.memo,
        servings: body.servings,
        thumbnailUrl: body.thumbnailImageUrl ?? null,
        category: body.category ?? RecipeCategory.UNCLASSIFIED,
        sourceType: body.sourceType,
      },
      include: {
        recipeIngredients: true,
        recipeSteps: true,
      },
    });

    //材料は一旦全部削除
    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: params.id },
    });

    //再度生成
    for (let i = 0; i < body.ingredients.length; i++) {
      const ing = body.ingredients[i];

      await prisma.recipeIngredient.create({
        data: {
          quantityText: Number(ing.amount),
          sortOrder: i,

          recipe: {
            connect: { id: params.id },
          },

          ingredient: {
            create: {
              name: ing.name,
              normalizedName: ing.name,
            },
          },
          unit: {
            connect: {
              id: ing.unitId,
            },
          },
        },
      });
    }

    //手順も全部削除
    await prisma.recipeStep.deleteMany({
      where: { recipeId: params.id },
    });

    for (let i = 0; i < body.steps.length; i++) {
      const step = body.steps[i];

      if (!step.recipestep?.trim()) continue;

      await prisma.recipeStep.create({
        data: {
          instructionText: step.recipestep,
          sortOrder: i,
          stepNumber: i + 1,
          recipe: {
            connect: { id: params.id },
          },
        },
      });
    }

    //再度生成

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: '更新に失敗しました' },
      { status: 500 },
    );
  }
};
