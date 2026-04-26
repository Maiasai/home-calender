//献立更新用データ型（API用）

import { MealType } from '@/generated/prisma';

export type MealRequestBodyEdit = {
  id: string;
  date: string;
  recipes: {
    recipeId: string;
    mealType: MealType;
    position: number;
  }[];
};
