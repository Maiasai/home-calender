//レシピ詳細取得API
//URLのidを受け取ってDBからその１件を探してJSONで返す

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RecipeCategory, RecipeSourceType } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { createNotification } from '@/lib/notification';

//左辺→分割代入、右辺→型指定（idはstrigですと言ってるだけ）　　{params} : { params : {id:string}}
export const GET = async (
  request: NextRequest, //ここのGETやPOSTでAppRouterのAPIはHTTPメソッドを判断してる
  { params }: { params: { id: string } },
) => {
  //
  //DBから一件だけ取得する

  const user = await requireUser(request); //認証チェック（関数コンポーネント）
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser?.activeFamilyId) {
    return NextResponse.json(
      { message: 'family not found' },

      { status: 404 },
    );
  }

  const recipe = await prisma.recipe.findFirst({
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
  try {
    const user = await requireUser(request); //Supabaseが特定したログインユーザーがここに来る
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'family not found' },
        { status: 404 },
      );
    }
    const activeFamilyId = dbUser.activeFamilyId;

    await prisma.$transaction(async (tx) => {
      await Promise.all([
        tx.userRecipeStatus.deleteMany({
          where: { recipeId: params.id },
        }),
        tx.familyRecipeStatus.deleteMany({
          where: { recipeId: params.id },
        }),

        tx.recipeIngredient.deleteMany({
          where: { recipeId: params.id },
        }),
        tx.recipeStep.deleteMany({
          where: { recipeId: params.id },
        }),
        tx.menuRecipe.deleteMany({
          where: { recipeId: params.id },
        }),
      ]);
      const result = await tx.recipe.deleteMany({
        where: {
          id: params.id,

          familyId: activeFamilyId,
        },
      });

      if (result.count === 0) {
        throw new Error('削除対象のレシピが見つかりません');
      }
      await Promise.all([
        tx.menu.deleteMany({
          where: {
            familyId: activeFamilyId,
            menuRecipes: {
              none: {},
            },
          },
        }),
        tx.ingredient.deleteMany({
          where: {
            familyId: activeFamilyId,
            recipeIngredients: {
              none: {},
            },
          },
        }),
      ]);
    });
    return NextResponse.json({ message: '削除しました' });
  } catch (error) {
    console.log('DELETE recipe error', error);
    return NextResponse.json(
      { message: '削除中にエラーが発生しました' },
      { status: 500 },
    );
  }
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
    const user = await requireUser(request);
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

    const activeFamilyId = dbUser.activeFamilyId;

    const recipedata = await prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.update({
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

      await Promise.all([
        //材料は一旦全部削除
        tx.recipeIngredient.deleteMany({
          where: { recipeId: params.id },
        }),
        //手順も全部削除
        tx.recipeStep.deleteMany({
          where: { recipeId: params.id },
        }),
      ]);

      //再度生成
      for (let i = 0; i < body.ingredients.length; i++) {
        //配列のi番目を取り出す
        const ing = body.ingredients[i];

        const displayName = ing.name?.trim();
        const normalizedName = displayName?.toLowerCase();

        if (!displayName || !normalizedName) continue;
        const amount =
          typeof ing.amount === 'number' && !Number.isNaN(ing.amount)
            ? ing.amount
            : null;

        const unitId = ing.unitId?.trim() || null;

        await tx.recipeIngredient.create({
          data: {
            quantityText: amount,
            sortOrder: i,
            recipe: {
              connect: { id: params.id },
            },
            ingredient: {
              connectOrCreate: {
                where: {
                  familyId_normalizedName: {
                    familyId: activeFamilyId,
                    normalizedName,
                  },
                },
                create: {
                  familyId: activeFamilyId,
                  name: displayName,
                  normalizedName,
                },
              },
            },
            unit: unitId
              ? {
                  connect: { id: unitId },
                }
              : undefined,
          },
        });
      }
      // どのレシピからも使われなくなったIngredientだけ削除
      await tx.ingredient.deleteMany({
        where: {
          familyId: activeFamilyId,
          recipeIngredients: {
            none: {},
          },
        },
      });

      for (let i = 0; i < body.steps.length; i++) {
        const step = body.steps[i];

        if (!step.recipestep?.trim()) continue;

        await tx.recipeStep.create({
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
      await createNotification({
        familyId: recipe.familyId,
        actorUserId: user.id,
        type: 'RECIPE_UPDATED',
      });
      return recipe;
    });
    return NextResponse.json(recipedata, { status: 200 });
  } catch (error) {
    console.error('PUT ERROR:', error);
    return NextResponse.json(
      { message: '更新に失敗しました', error: String(error) },
      { status: 500 },
    );
  }
};
