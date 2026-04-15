//レシピ一覧API

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import requireUser from '@/lib/auth';
import { RecipeCategory } from '@/generated/prisma';

export const runtime = 'nodejs';

export const GET = async (request: Request) => {
  try {
    const user = await requireUser();

    //ここでURLオブジェクトに変換
    const { searchParams } = new URL(request.url); //request.url中身は「http://localhost:3000/api/recipes?category=MAIN」のような形式

    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category'); //（例）category="MAIN"
    const isFavorite = searchParams.get('favorite');
    const isCooked = searchParams.get('cooked');

    const recipeget = await prisma.recipe.findMany({
      //レシピテーブル全件を取得
      where: {
        ownerUserId: user.id, //ここでログインしているユーザーのレシピだけ取得する※初期ユーザー作成時「id:user.id」を入れているため。

        //条件があるときだけ以下追加
        //レシピ名検索
        ...(keyword && {
          OR: [
            //OR[{条件1},{条件2},]→レシピ名or材料名
            {
              title: {
                contains: keyword,
                mode: 'insensitive',
              },
            },

            {
              recipeIngredients: {
                some: {
                  //「1つでも条件に合うものがあればOK」
                  ingredient: {
                    name: {
                      contains: keyword,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            },
          ],
        }),

        //カテゴリ絞り込み
        ...(category && {
          category: category as RecipeCategory, //searchParams.get() は常に string | null を返す。→カテゴリenumだから合わないため
        }),

        //お気に入り絞り込み
        ...(isFavorite === 'true' && {
          userRecipeStatus: {
            //ログインユーザーのIDにisFavorite=trueが紐いているレシピだけとる
            some: {
              //「ログインユーザーの状態テーブルの中に1件でもtrueがあるか」
              userId: user.id, //ログインユーザー
              isFavorite: true,
            },
          },
        }),

        //作ったもの絞り込み
        ...(isCooked === 'true' && {
          userRecipeStatus: {
            some: {
              userId: user.id,
              hasCooked: true,
            },
          },
        }),
      },

      orderBy: {
        createdAt: 'desc',
      },

      select: {
        //includeは追加するものを指定する仕組みだが、selectは残すものを指定する仕組み
        id: true,
        title: true,
        category: true,
        thumbnailUrl: true,
        userRecipeStatus: {
          //userRecipeStatusはこのユーザーの分だけ返して（返す関連データを絞る）
          where: {
            userId: user.id,
          },
          select: {
            isFavorite: true,
            hasCooked: true,
          },
        },
      },
    });

    return NextResponse.json(recipeget, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 },
    );
  }
};

//レシピ新規作成
interface CreatePostRequestBody {
  //bodyの形
  title: string;
  memo?: string;
  servings: number;
  thumbnailImageUrl: string;
  ingredients: {
    name: string;
    amount: number;
    unitId: string;
  }[];

  steps: { recipestep: string }[];
  category?: RecipeCategory; //　?　= undefinedが追加される（プリズマの型を追加）
}

export const POST = async (request: Request) => {
  try {
    const user = await requireUser();
    const userId = user.id;

    const body: CreatePostRequestBody = await request.json();
    const {
      title,
      memo,
      servings,
      thumbnailImageUrl,
      ingredients,
      steps,
      category,
    } = body;

    if (!body.title) {
      return NextResponse.json(
        { message: ' タイトルは必須です ' },
        { status: 400 },
      );
    }

    if (!body.servings) {
      return NextResponse.json(
        { message: ' 人数は必須です ' },
        { status: 400 },
      );
    }

    if (!body.ingredients || ingredients.length === 0) {
      //材料が存在しない または　材料が空配列ならtrue
      return NextResponse.json(
        { message: ' 材料は必須です ' },
        { status: 400 },
      );
    }

    if (!body.steps || steps.length === 0) {
      return NextResponse.json(
        { message: ' 手順は必須です ' },
        { status: 400 },
      );
    }

    const recipedata = await prisma.recipe.create({
      //テーブル操作。データベースに保存する処理
      data: {
        title,
        memo,
        servings,
        thumbnailUrl: thumbnailImageUrl,
        category: category ?? RecipeCategory.UNCLASSIFIED, //enumの場合はそのまま記載
        sourceType: 'MANUAL',
        ownerUser: {
          connect: { id: userId }, //ownerUser を createに渡す※Recipe.ownerUserId = userId
        },
      },
    });

    //材料を作成
    //①index を 0 から始めて、ingredients.length 未満の間、1ずつ増やす（材料を1つずつDBに保存するため）
    for (let index = 0; index < ingredients.length; index++) {
      const ingre = ingredients[index]; //②ingredients の中の 1つを取り出してingre という名前の箱にindexごとに入れる　*ingreの中に全ての材料が入るわけではない。

      await prisma.recipeIngredient.create({
        //③やってきた材料をDBに保存＞①からまた取り出してきて②→③と動いて保存される。（１つずつ）
        data: {
          quantityText: ingre.amount,
          sortOrder: index,

          recipe: {
            //recipeIngredientのrecipe(本来はrecipeIdをrecipe.idと接続したいが、connectが書けるのはリレーションのみだからrecipeと書く。)
            connect: {
              //　内部的には「recipeId = recipedata.id」となっている
              id: recipedata.id,
            }, //recipedata.id→前にcreateしたrecipeの戻り値からきてる。※　新しく作ったrecipeのid　→　recipedata = {id: "ckabc123",title: "カレー",...}
          },

          ingredient: {
            //ingredientテーブルに新しい材料を作って、 同時にその ingredientId を RecipeIngredient に入れる
            create: {
              name: ingre.name,
              normalizedName: ingre.name,
            },
          },
          unit: {
            //unitはすでにDBに存在しているためconnect
            connect: {
              id: ingre.unitId, //フロントでユーザーが選択した単位は、idでやり取りされる
            },
          },
          //既に存在するもの→connect、新しく作るもの→create
        },
      });
    }

    //手順を作成
    for (let index = 0; index < steps.length; index++) {
      const step = steps[index];
      await prisma.recipeStep.create({
        data: {
          instructionText: step.recipestep,

          sortOrder: index,
          stepNumber: index + 1,
          recipe: {
            connect: { id: recipedata.id }, //connect→既存のレコードと紐づけるという意味
          },
        },
      });
    }

    return NextResponse.json({ recipeId: recipedata.id }, { status: 200 });
  } catch (error) {
    console.error('API ERROR:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 400 },
    );
  }
};
