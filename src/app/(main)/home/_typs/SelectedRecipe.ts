//献立作成モーダルにて選択済みレシピ型

import { MealTypeExtended } from './MealTypeExtended';

export type SelectedRecipe = {
  id: string;
  title: string;
  thumbnailUrl?: string;
  mealType: MealTypeExtended;
  position?: number;
};
