import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

//このAPIは Node.js 環境で動かしてと伝えてる
//サーバー側でJavaScriptを動かす環境
export const runtime = 'nodejs';

const supabaseAdmin = createClient(
  //ここでenvの値を取り出してる
  process.env.NEXT_PUBLIC_SUPABASE_URL!, //どこのsupabaseに接続するのか//NEXT_PUBLIC→フロントから見えても問題ない情報
  process.env.SUPABASE_SERVICE_ROLE_KEY!, //Supabaseの管理者権限を持ってる
);

export const DELETE = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);
    const userId = user.id;

    const [dbUser, ownedFamilies] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          homeFamilyId: true,
          activeFamilyId: true,
        },
      }),

      prisma.family.findMany({
        where: {
          ownerUserId: userId,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!dbUser) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    const deleteFamilyIds = Array.from(
      new Set(
        [
          dbUser.homeFamilyId,

          ...ownedFamilies.map((family) => family.id),
        ].filter(Boolean),
      ),
    ) as string[];

    await prisma.$transaction(async (tx) => {
      // 1. 自分のhomeFamilyを見ている参加者を、自分自身のhomeFamilyへ戻す

      if (deleteFamilyIds.length > 0) {
        const sharedUsers = await tx.user.findMany({
          where: {
            activeFamilyId: { in: deleteFamilyIds },
            NOT: { id: userId },
          },

          select: {
            id: true,
            homeFamilyId: true,
          },
        });

        await Promise.all(
          sharedUsers.map((sharedUser) =>
            tx.user.update({
              where: { id: sharedUser.id },
              data: { activeFamilyId: sharedUser.homeFamilyId },
            }),
          ),
        );
      }

      // 2. 自分自身のFamily参照を外す

      await tx.user.update({
        where: { id: userId },

        data: {
          activeFamilyId: null,

          homeFamilyId: null,
        },
      });

      // 3. 自分のhomeFamilyに紐づくデータを削除

      if (deleteFamilyIds.length > 0) {
        const [recipes, menus] = await Promise.all([
          tx.recipe.findMany({
            where: { familyId: { in: deleteFamilyIds } },

            select: { id: true },
          }),

          tx.menu.findMany({
            where: { familyId: { in: deleteFamilyIds } },

            select: { id: true },
          }),
        ]);

        const recipeIds = recipes.map((recipe) => recipe.id);
        const menuIds = menus.map((menu) => menu.id);

        await Promise.all([
          tx.menuRecipe.deleteMany({
            where: {
              OR: [
                { menuId: { in: menuIds } },
                { recipeId: { in: recipeIds } },
              ],
            },
          }),

          tx.recipeIngredient.deleteMany({
            where: {
              recipeId: { in: recipeIds },
            },
          }),

          tx.recipeStep.deleteMany({
            where: {
              recipeId: { in: recipeIds },
            },
          }),

          tx.userRecipeStatus.deleteMany({
            where: {
              OR: [{ userId }, { recipeId: { in: recipeIds } }],
            },
          }),

          tx.familyRecipeStatus.deleteMany({
            where: {
              familyId: { in: deleteFamilyIds },
            },
          }),

          tx.notification.deleteMany({
            where: {
              OR: [
                { familyId: { in: deleteFamilyIds } },
                { actorUserId: userId },
              ],
            },
          }),
        ]);

        (await Promise.all([
          tx.menu.deleteMany({
            where: {
              familyId: { in: deleteFamilyIds },
            },
          }),

          tx.shoppingItem.deleteMany({
            where: {
              familyId: { in: deleteFamilyIds },
            },
          }),

          tx.recipe.deleteMany({
            where: {
              familyId: { in: deleteFamilyIds },
            },
          }),

          tx.ingredient.deleteMany({
            where: {
              familyId: { in: deleteFamilyIds },
            },
          }),

          tx.familyInvite.deleteMany({
            where: {
              familyId: { in: deleteFamilyIds },
            },
          }),

          tx.familyMember.deleteMany({
            where: {
              familyId: { in: deleteFamilyIds },
            },
          }),
        ]),
          await tx.family.deleteMany({
            where: {
              id: { in: deleteFamilyIds },
            },
          }));
      }

      // 4. 自分が他の共有グループに参加していた分も解除

      await Promise.all([
        tx.familyMember.deleteMany({
          where: {
            userId,
          },
        }),

        // 5. 自分が関係する通知・お気に入りを削除

        tx.notification.deleteMany({
          where: {
            actorUserId: userId,
          },
        }),

        tx.userRecipeStatus.deleteMany({
          where: {
            userId,
          },
        }),
      ]);

      // 6. アプリ側User削除

      await tx.user.delete({
        where: {
          id: userId,
        },
      });
    });

    // 7. Supabase Auth側ユーザー削除

    const { error: authDeleteError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authDeleteError) {
      console.log('Supabase auth delete error', authDeleteError);

      return NextResponse.json(
        {
          message:
            'アプリ内データは削除されましたが、認証ユーザーの削除に失敗しました',
        },

        { status: 500 },
      );
    }
    return NextResponse.json({ message: '退会しました' });
  } catch (error) {
    return NextResponse.json(
      { message: '削除中にエラーが発生しました' },
      { status: 500 },
    );
  }
};
