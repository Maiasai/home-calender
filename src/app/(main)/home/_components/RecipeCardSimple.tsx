//レシピカード（献立作成モーダルにて表示）
'use client';

import { SelectedRecipe } from '../_typs/SelectedRecipe';
import { RecipeData } from '../../recipes/_types/RecipeTypes';
import Image from 'next/image';
import { truncateRecipeListTitle } from '@/utils/format';

type Props = {
  recipe: RecipeData;
  selectedRecipes: SelectedRecipe[];
  toggleSelect: (recipe: RecipeData) => void;
};

const RecipeCardSimple = ({ recipe, selectedRecipes, toggleSelect }: Props) => {
  const isSelected = selectedRecipes.some((r) => r.id === recipe.id);

  const imageSrc =
    recipe.thumbnailUrl && recipe.thumbnailUrl.trim() !== ''
      ? recipe.thumbnailUrl
      : '/images/noImage.jpg';

  return (
    <div
      className={`
        cursor-pointer
        ${isSelected ? 'border-orange-300 border-2 rounded-md p-1' : ''}
      `}
    >
      <div className="border shadow">
        <div
          className="relative"
          onClick={() => toggleSelect(recipe)} //選択されたレシピが、オブジェクトで関数に渡される
        >
          <div className="relative w-full max-w-[180px] aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src={imageSrc}
              alt="レシピ画像"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex justify-between ml-1">
            {truncateRecipeListTitle(recipe.title)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCardSimple;
