//一括削除用API

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ApiOkResponse } from '../../_types/ApiOkResponse';
import requireUser from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
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
    //フロントで fetch した際の selectedIds が ids としてサーバーに届く
    const { ids } = await request.json(); // string[]が期待

    const activeid = dbUser.activeFamilyId;

    const getStoragePathFromPublicUrl = (url: string) => {
      const marker = '/storage/v1/object/public/post_thumbnail/';
      const index = url.indexOf(marker); //その文字列が何文字目から始まるかを確認するメソッド

      if (index === -1) return null;

      //infexはhttp〜/strorageの手前までの数　＋　markerの長さになるので。取り出したいprivateの前の数を出すことができる
      return url.slice(index + marker.length);
    };

    //削除指定のidsをもとにレシピ画像URLも取得
    const recipes = await prisma.recipe.findMany({
      where: {
        id: { in: ids },
        familyId: activeid,
      },
      select: {
        thumbnailUrl: true,
      },
    });

    const imagePaths = recipes
      .map((recipe) =>
        recipe.thumbnailUrl
          ? getStoragePathFromPublicUrl(recipe.thumbnailUrl)
          : null,
      )

      //ここで配列に混ざったnullを消す
      .filter((path): path is string => path !== null);

    // 外部キー制約に引っかからないように、まず関連テーブルを削除
    // deleteMany + whereで配列のIDに該当する全レコードを削除
    await prisma.$transaction(async (tx) => {
      await Promise.all([
        tx.userRecipeStatus.deleteMany({
          where: { recipeId: { in: ids } },
        }),
        tx.familyRecipeStatus.deleteMany({
          where: { recipeId: { in: ids } },
        }),

        tx.recipeIngredient.deleteMany({
          where: { recipeId: { in: ids } },
        }),

        tx.recipeStep.deleteMany({
          where: { recipeId: { in: ids } },
        }),

        tx.menuRecipe.deleteMany({
          where: { recipeId: { in: ids } },
        }),
      ]);
      await tx.menu.deleteMany({
        where: {
          familyId: activeid,
          menuRecipes: {
            none: {},
          },
        },
      });

      // どのレシピにも使われていない材料マスタを削除

      await tx.ingredient.deleteMany({
        where: {
          familyId: activeid,
          recipeIngredients: {
            none: {},
          },
        },
      });

      // 最後に Recipe を削除
      await tx.recipe.deleteMany({
        where: { id: { in: ids }, familyId: activeid },
      });
    });

    //// DB削除が成功した後にStorage削除
    if (imagePaths.length > 0) {
      const { error } = await supabaseAdmin.storage
        .from('post_thumbnail')
        .remove(imagePaths);

      if (error) {
        console.error('Storage画像削除失敗:', error.message);
      }
    }

    return NextResponse.json<ApiOkResponse>({ ok: true });
  } catch (err) {
    console.error('bulk delete error:', err);

    return NextResponse.json(
      { message: 'エラーが発生しました', error: err },
      { status: 500 },
    );
  }
}
