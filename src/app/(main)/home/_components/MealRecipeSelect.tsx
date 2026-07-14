//献立作成モーダル（切り替え用）
'use client';

import { Dispatch, SetStateAction } from 'react';
import { SelectedRecipe } from '../_typs/SelectedRecipe';
import { RecipeData } from '../../recipes/_types/RecipeTypes';
import RecipeCardSimple from './RecipeCardSimple';

type Props = {
  recipes: RecipeData[] | undefined;

  selectedRecipes: SelectedRecipe[];
  setSelectedRecipes: Dispatch<SetStateAction<SelectedRecipe[]>>;
};

const MealRecipeSelect = ({
  recipes,
  selectedRecipes,
  setSelectedRecipes,
}: Props) => {
  //レシピ選択関数
  const toggleSelect = (recipe: RecipeData) => {
    //recipeは一件分のデータ（押されるごとにここを通ってくる）
    setSelectedRecipes((prev) => {
      //prevは今まで選択されてた、レシピオブジェクトの配列

      const exists = prev.find((r) => r.id === recipe.id); //すでに選択されているidかチェック

      // existsに入ってるid以外だけを残す（　= 選択済みのid削除）
      if (exists) {
        return prev.filter((r) => r.id !== recipe.id);
      }

      // 上限9件
      if (prev.length >= 9) {
        return prev;
      }

      // 新規追加（
      return [
        //これが新しいselectedRecipesになる
        ...prev, //今までの配列を展開
        {
          //入ってきたレシピ→必要なデータだけ取り出す
          id: recipe.id,
          title: recipe.title,
          thumbnailUrl: recipe.thumbnailUrl ?? '/images/noImage.jpg',
          mealType: 'UNSELECTED', //初期値は未分類
        },
      ];
    });
  };

  return (
    <div className="p-2">
      <div>{selectedRecipes.length}/9件選択</div>

      {/* 検索結果ない場合 */}
      {recipes?.length === 0 && (
        <p className="text-center mt-16 mb-16">
          該当のレシピがありませんでした
        </p>
      )}

      {/* レシピカード */}
      <div className="grid grid-cols-3 gap-3">
        {recipes?.map((recipe) => (
          <RecipeCardSimple
            key={recipe.id} //keyは子に渡せない
            recipe={recipe}
            selectedRecipes={selectedRecipes}
            toggleSelect={toggleSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default MealRecipeSelect;
