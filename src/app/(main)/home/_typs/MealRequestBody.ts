//献立作成用データ型

import { MealType } from '@/generated/prisma';

export type MealRequestBody = {
  date: string; // ← JSON では string になるので string
  recipes: {
    recipeId: string;
    mealType: MealType;
    position?: number;
  }[];
};
