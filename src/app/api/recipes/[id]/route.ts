//レシピ詳細取得API
//URLのidを受け取ってDBからその１件を探してJSONで返す

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RecipeCategory, RecipeSourceType } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

//左辺→分割代入、右辺→型指定（idはstrigですと言ってるだけ）　　{params} : { params : {id:string}}
export const GET = async (
  request: NextRequest, //ここのGETやPOSTでAppRouterのAPIはHTTPメソッドを判断してる
  { params }: { params: { id: string } },
) => {
  //
  //DBから一件だけ取得する

  const user = await requireUser(); //認証チェック（関数コンポーネント）
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser?.activeFamilyId) {
    return NextResponse.json(
      { message: 'family not found' },

      { status: 404 },
    );
  }

  const recipe = await prisma.recipe.findUnique({
    //DBから一意なキーで一件だけ取得（ここでの型はRecipe | null）
    where: {
      //URLで渡されたidのレシピを探して（ここで条件を渡してる）
      id: params.id, //ここでidを指定
      familyId: dbUser.activeFamilyId,
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
  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser?.activeFamilyId) {
    return NextResponse.json({ message: 'family not found' }, { status: 404 });
  }

  const result = await prisma.recipe.deleteMany({
    where: {
      //この2つの条件に一致するレコードだけ削除
      id: params.id,
      familyId: dbUser.activeFamilyId, //家族共有データだけ取る
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
  sourceUrl: string;
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const user = await requireUser();
    const body: CreatePutRequestBody = await request.json();
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'family not found' },
        { status: 404 },
      );
    }
    const targetRecipe = await prisma.recipe.findFirst({
      where: {
        id: params.id,
        familyId: dbUser.activeFamilyId,
      },
    });

    if (!targetRecipe) {
      return NextResponse.json(
        { message: 'recipe not found' },
        { status: 404 },
      );
    }
    const target = await prisma.recipe.findFirst({
      where: {
        id: params.id,
        familyId: dbUser.activeFamilyId,
      },
    });

    if (!target) {
      return NextResponse.json({ message: 'not found' }, { status: 404 });
    }

    const recipe = await prisma.recipe.update({
      where: {
        id: params.id, //URLから取得したレシピのID
      },

      data: {
        title: body.title,
        memo: body.memo,
        servings: body.servings,
        thumbnailUrl: body.thumbnailImageUrl ?? null,
        category: body.category ?? RecipeCategory.UNCLASSIFIED,
        sourceType: body.sourceType,
        updatedByUserId: user.id,
        sourceUrl: body.sourceUrl,
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
      //配列のi番目を取り出す
      const ing = body.ingredients[i];
      //空の行は個々にSKIP
      const isEmpty = !ing.name && !ing.amount && !ing.unitId;

      if (isEmpty) continue;

      await prisma.recipeIngredient.create({
        data: {
          quantityText: ing.amount ?? null,
          sortOrder: i,

          recipe: {
            connect: { id: params.id },
          },

          ingredient: {
            connectOrCreate: {
              where: {
                name: ing.name,
              },
              create: {
                name: ing.name,
                normalizedName: ing.name,
              },
            },
          },
          unit: ing.unitId
            ? {
                connect: { id: ing.unitId },
              }
            : undefined,
        },
      });
    }
    console.log('BEFORE CREATE ING');

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

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error('PUT ERROR:', error);
    return NextResponse.json(
      { message: '更新に失敗しました', error: String(error) },
      { status: 500 },
    );
  }
};
