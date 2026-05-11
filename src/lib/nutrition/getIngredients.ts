//食材を集める関数
//menu から ingredient 一覧だけ取り出す

import { Meal } from '@/app/(main)/home/_typs/Meal';

export const getIngredients = (meal: Meal) => {
  if (!meal) return [];

  return meal?.recipes.flatMap((r) =>
    (r.recipe.ingredients ?? []).map((i) => ({
      //栄養判定専用データに変換
      name: i.name,
      nutritionCategory: i.nutritionCategory,
    })),
  );
};
