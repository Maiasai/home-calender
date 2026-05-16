//献立作成モーダル（切り替え用）
'use client';

import { Dispatch, SetStateAction } from 'react';
import { SelectedRecipe } from '../_typs/SelectedRecipe';
import Image from 'next/image';
import { RecipeData } from '../../recipes/_types/RecipeTypes';
import SearchBarSimple from '../../recipes/_components/SearchBarSimple';
import FilterPanel from '../../recipes/_components/FilterPanel';
import RecipeCardSimple from './RecipeCardSimple';
import CategoryFilterButtons from '../../recipes/_components/CategoryFilterButtons';
import { CategoryFilter } from '../../recipes/_types/category/CategoryFilter';

type Props = {
  recipes: RecipeData[] | undefined;
  inputKeyword: string;

  //意味）　Dispatch　<T>　→　Tを引数にする関数
  //SetStateAction<string>の中身　→　string | ((prev: string) => string)（意味） 値 or 関数どっちでもOK
  setInputKeyword: Dispatch<SetStateAction<string>>;
  setKeyword: (v: string) => void;
  favoriteFilter: boolean;
  setFavoriteFilter: (v: boolean) => void;
  cookedFilter: boolean;
  setCookedFilter: (v: boolean) => void;
  category: CategoryFilter;
  setCategory: (v: CategoryFilter) => void;
  selectedRecipes: SelectedRecipe[];
  setSelectedRecipes: Dispatch<SetStateAction<SelectedRecipe[]>>;
  onBack: () => void;
};

const MealRecipeSelect = ({
  recipes,

  inputKeyword,
  setInputKeyword,
  setKeyword,
  favoriteFilter,
  setFavoriteFilter,
  cookedFilter,
  setCookedFilter,
  category,
  setCategory,
  selectedRecipes,
  setSelectedRecipes,
  onBack,
}: Props) => {
  const hasSelectedRecipes = selectedRecipes.length > 0;
  const isDisabled = !hasSelectedRecipes; //選択なしなら非活性

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

      // 上限6件
      if (prev.length >= 6) {
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
    <>
      <div className="flex flex-row w-full justify-end mb-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isDisabled}
          className={`transition
            ${isDisabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
        >
          <Image
            src="/images/save.png"
            alt="保存ボタン"
            width={70}
            height={70}
          />
        </button>
      </div>

      {/* 検索・絞り込み項目（レシピ一覧と検索周りに差異があるため、別コンポーネントで管理） */}
      <SearchBarSimple
        inputKeyword={inputKeyword}
        setInputKeyword={setInputKeyword}
        setKeyword={setKeyword}
      />
      {/* お気に入りと作ったことある絞り込み */}
      <FilterPanel
        favoriteFilter={favoriteFilter}
        setFavoriteFilter={setFavoriteFilter}
        cookedFilter={cookedFilter}
        setCookedFilter={setCookedFilter}
      />

      {/* カテゴリ絞り込み※クリック時にセット */}
      <CategoryFilterButtons category={category} setCategory={setCategory} />

      <div>{selectedRecipes.length}/6件選択</div>

      {/* 検索結果ない場合 */}
      {recipes?.length === 0 && (
        <p className="text-center mt-4">該当のレシピがありませんでした</p>
      )}

      {/* レシピカード */}
      <div className="grid grid-cols-3 gap-2">
        {recipes?.map((recipe) => (
          <RecipeCardSimple
            key={recipe.id} //keyは子に渡せない
            recipe={recipe}
            selectedRecipes={selectedRecipes}
            toggleSelect={toggleSelect}
          />
        ))}
      </div>
    </>
  );
};

export default MealRecipeSelect;
