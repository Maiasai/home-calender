//献立作成モーダルにて選択済みレシピ型

import { UiMealType } from './UiMealType';

export type SelectedRecipe = {
  id: string;
  title: string;
  thumbnailUrl?: string;
  mealType: UiMealType;
  position?: number;
};
