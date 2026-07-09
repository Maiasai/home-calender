//FavoriteButtonもしくはCookedButtonが走ったあと、ここの関数が実行
//レシピ ID と、どのステータスを更新するか（お気に入り or 作った）を送る関数

import { KeyedMutator } from 'swr/_internal';
import { RecipeData } from '../../recipes/_types/RecipeTypes';

type CookedAndIsFavoriteRequestBody = {
  isFavorite?: boolean;
  hasCooked?: boolean;
};

//「この関数に渡せる文字列はこの2つだけですよ」という制約
type StatusKey = 'isFavorite' | 'hasCooked';

const toggleStatus = async (
  id: string, // ← recipe.id レシピID
  current: boolean, // ← isFav 現在の状態（お気に入りかどうか / 作ったことあるか）
  key: StatusKey, // ← "isFavorite" どのステータスを更新するか
  mutate: KeyedMutator<RecipeData[]>, // ← mutate を引数で受け取る
  token: string | null,
) => {
  // UIの先行更新（optimistic update）
  //mutateは再取得だけじゃない。mutate((現在のキャッシュ) => 新しいキャッシュ, false)でキャッシュだけ先に書き換えができてしまう
  mutate((recipes: RecipeData[] | undefined) => {
    //このrecipesは/api/recipesから取ってきたキャッシュデータ
    if (!recipes) return recipes;

    return recipes.map((reciper) => {
      //recipes配列の中の該当レシピだけ書き換える

      if (reciper.id === id) {
        if (key === 'isFavorite') {
          //該当レシピを探す（クリックされたレシピだけ変更）
          return {
            ...reciper,
            userRecipeStatus: [
              {
                //既存の userRecipeStatus[0] があればコピー
                // reciper.userRecipeStatus?.[0]がundefinedのまま展開するとエラーになるから、
                // なければ { isFavorite: false } を仮で使う
                ...(reciper.userRecipeStatus?.[0] ?? {
                  isFavorite: false,
                }),
                isFavorite: !current,
                // その後で isFavorite: !current で上書き
              },
            ],
          };
        }

        if (key === 'hasCooked') {
          return {
            ...reciper,
            familyRecipeStatus: [
              {
                ...(reciper.familyRecipeStatus?.[0] ?? {
                  hasCooked: false,
                }),
                hasCooked: !current,
              },
            ],
          };
        }
      }
      return reciper; //変更対象じゃないレシピはそのまま返す
    });
  }, false); //false→このmutate直後に再取得しない

  //API更新
  const apiPath = key === 'isFavorite' ? 'favorite' : 'cooked'; //（意味）もしkeyがisFavoriteならfavorite、それ以外ならcooked

  //送られてきたお気に入り（true/false）状態を!で反転→PATCHでAPIからDB更新
  const requestBody: CookedAndIsFavoriteRequestBody = {
    [key]: !current, //keyの名前をそのままプロパティ名にする
  };

  await fetch(`/api/recipes/${id}/${apiPath}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });
  mutate(); //SWRのデータを再取得する命令（GET /api/recipes）→最新のisFavorite/hasCookedがUIに反映
};

export default toggleStatus;
