
//FavoriteButtonもしくはCookedButtonが走ったあと、ここの関数が実行

'use client'

import { RecipeData } from "@/app/_components/recipe/_types/RecipeTypes";
import { KeyedMutator } from "swr/_internal";



//「この関数に渡せる文字列はこの2つだけですよ」という制約
type StatusKey =
 "isFavorite" | "hasCooked";

const toggleStatus = async(
  id:string,// ← recipe.id レシピID
  current:boolean,// ← isFav 現在の状態（お気に入りかどうか / 作ったことあるか）
  key:StatusKey, // ← "isFavorite" どのステータスを更新するか
  mutate: KeyedMutator<RecipeData[]> // ← mutate を引数で受け取る
) => {
  // UIの先行更新（optimistic update）
  mutate((recipes:RecipeData[] | undefined)=>{//このrecipesは/api/recipesから取ってきたキャッシュデータ
    if(!recipes) return recipes;

    return recipes.map((reciper)=>{//recipes配列の中の該当レシピだけ書き換える
      
      if (reciper.id === id ){//該当レシピを探す（クリックされたレシピだけ変更）
        return {
          ...reciper,
          userRecipeStatus:[
            {//既存状態を保持しつつ切り替える
              ...reciper.userRecipeStatus?.[0]??{
                isFavorite:false,
                hasCooked:false
              },
              [key] : !current
            }
          ]
        }
      }
      return reciper//APIを再取得しない（SWRキャッシュだけ更新）
      })
    },false)

    //API更新
    const apiPath = key === "isFavorite" ? "favorite" : "cooked";//（意味）もしkeyがisFavoriteならfavorite、それ以外ならcooked
    await fetch(`/api/recipes/${id}/${apiPath}`,{
      method:"PATCH",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        [key]:!current,//送られてきたお気に入り（true/false）状態を!で反転→PATCHでAPIからDB更新
        //APIはhasCookedを期待しているので、ここはhasCooked
      }),
    });
    mutate();//SWRのデータを再取得する命令（GET /api/recipes）→最新のisFavorite/hasCookedがUIに反映
  };

  export default toggleStatus;