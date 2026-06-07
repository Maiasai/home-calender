import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const DELETE = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);
    const userId = user.id;
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        homeFamilyId: true,
        activeFamilyId: true,
      },
    });

    if (!dbUser?.activeFamilyId) {
      return NextResponse.json(
        { message: 'family not found' },
        { status: 404 },
      );
    }
    const homeFamilyId = dbUser.homeFamilyId;

    await prisma.$transaction(async (tx) => {
      // 1. 自分のhomeFamilyを見ている参加者を、自分自身のhomeFamilyへ戻す

      if (homeFamilyId) {
        const sharedUsers = await tx.user.findMany({
          where: {
            activeFamilyId: homeFamilyId,

            NOT: { id: userId },
          },

          select: {
            id: true,

            homeFamilyId: true,
          },
        });

        for (const sharedUser of sharedUsers) {
          await tx.user.update({
            where: { id: sharedUser.id },

            data: {
              activeFamilyId: sharedUser.homeFamilyId,
            },
          });
        }
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

      if (homeFamilyId) {
        const recipes = await tx.recipe.findMany({
          where: { familyId: homeFamilyId },

          select: { id: true },
        });

        const recipeIds = recipes.map((recipe) => recipe.id);

        const menus = await tx.menu.findMany({
          where: { familyId: homeFamilyId },

          select: { id: true },
        });

        const menuIds = menus.map((menu) => menu.id);

        await tx.menuRecipe.deleteMany({
          where: {
            OR: [{ menuId: { in: menuIds } }, { recipeId: { in: recipeIds } }],
          },
        });

        await tx.recipeIngredient.deleteMany({
          where: {
            recipeId: { in: recipeIds },
          },
        });

        await tx.recipeStep.deleteMany({
          where: {
            recipeId: { in: recipeIds },
          },
        });

        await tx.userRecipeStatus.deleteMany({
          where: {
            OR: [{ userId }, { recipeId: { in: recipeIds } }],
          },
        });

        await tx.familyRecipeStatus.deleteMany({
          where: {
            familyId: homeFamilyId,
          },
        });

        await tx.notification.deleteMany({
          where: {
            OR: [{ familyId: homeFamilyId }, { actorUserId: userId }],
          },
        });

        await tx.menu.deleteMany({
          where: {
            familyId: homeFamilyId,
          },
        });

        await tx.shoppingItem.deleteMany({
          where: {
            familyId: homeFamilyId,
          },
        });

        await tx.recipe.deleteMany({
          where: {
            familyId: homeFamilyId,
          },
        });

        await tx.ingredient.deleteMany({
          where: {
            familyId: homeFamilyId,
          },
        });

        await tx.familyInvite.deleteMany({
          where: {
            familyId: homeFamilyId,
          },
        });

        await tx.familyMember.deleteMany({
          where: {
            familyId: homeFamilyId,
          },
        });

        await tx.family.delete({
          where: {
            id: homeFamilyId,
          },
        });
      }

      // 4. 自分が他の共有グループに参加していた分も解除

      await tx.familyMember.deleteMany({
        where: {
          userId,
        },
      });

      // 5. 自分が関係する通知・お気に入りを削除

      await tx.notification.deleteMany({
        where: {
          actorUserId: userId,
        },
      });

      await tx.userRecipeStatus.deleteMany({
        where: {
          userId,
        },
      });

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
    console.log('DELETE recipe error', error);
    return NextResponse.json(
      { message: '削除中にエラーが発生しました' },
      { status: 500 },
    );
  }
};
