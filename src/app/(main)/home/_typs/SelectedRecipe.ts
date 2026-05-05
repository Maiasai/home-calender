//献立作成モーダルにて選択済みレシピ型

import { MealType } from '@/generated/prisma';

export type SelectedRecipe = {
  id: string;
  title: string;
  thumbnailUrl?: string;
  mealType: MealType | null;
  position?: number;
};
