//献立作成モーダル（切り替え用）
'use client';

import { Dispatch, SetStateAction } from 'react';
import { SelectedRecipe } from '../_typs/SelectedRecipe';
import SearchBarSimple from '../../recipes/_components/SearchBarSimple';
import FilterPanel from '../../recipes/_components/FilterPanel';
import CategoryFilterButtons from '../../recipes/_components/CategoryFilterButtons';
import { CategoryFilter } from '../../recipes/_types/category/CategoryFilter';
import PrimaryButton from '@/components/button/PrimaryButton';

type Props = {
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
  onBack: () => void;
};

const MealRecipeSelectHeader = ({
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
  onBack,
}: Props) => {
  const hasSelectedRecipes = selectedRecipes.length > 0;
  const isDisabled = !hasSelectedRecipes; //選択なしなら非活性

  return (
    <>
      <div className="flex flex-row w-full justify-end mb-4 px-2">
        <PrimaryButton
          type="button"
          onClick={onBack}
          disabled={isDisabled}
          className="w-[80px] h-[30px]"
          variant="primary"
        >
          保存
        </PrimaryButton>
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
    </>
  );
};

export default MealRecipeSelectHeader;
