//献立作成用データ型

import { MealType } from './MealType';

export type MealRequestBody = {
  date: string;
  recipes: {
    recipeId: string;
    mealType: MealType;
    position: number;
  }[];
};
