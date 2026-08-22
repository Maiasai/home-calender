//カレンダーの献立の型

import { MealType } from '@/generated/prisma';
import { MealId } from './MealId';
import { ItemIngredient } from './Menu';

export type Meal = {
  id: MealId;
  date: string;
  recipes: {
    menuRecipeId: string; //献立登録1件のid
    recipe: {
      id: string;
      title: string;
      thumbnailUrl?: string;
      servings?: number | null;
      ingredients: ItemIngredient[];
    };
    mealType: MealType;
  }[];
};
