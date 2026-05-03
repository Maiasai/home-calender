//カレンダーの献立の型

import { MealType } from '@/generated/prisma';
import { MealId } from './MealId';
import { ItemIngredient } from './Menu';

export type Meal = {
  id: MealId;
  date: string;
  recipes: {
    recipe: {
      id: string;
      title: string;
      thumbnailUrl?: string;

      //URL登録レシピ では登録なしのためoptional
      ingredients?: ItemIngredient[];
    };
    mealType: MealType;
  }[];
};

type Ingredient = {
  id: string;
  name: string;
  amount?: string;
};
