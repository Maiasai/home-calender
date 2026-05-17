//食材を集める関数
//menu から ingredient 一覧だけ取り出す

import { Meal } from '@/app/(main)/home/_typs/Meal';
import { ingredientsData } from '@/../prisma/seeds/ingredients';
import { IngredientItem } from './typs';

export const getIngredients = (meal: Meal): (IngredientItem | null)[] => {
  if (!meal) return [];

  return meal?.recipes.flatMap((r) =>
    (r.recipe.ingredients ?? []).map((i) => {
      const matched = ingredientsData.find(
        (master) =>
          i.name.includes(master.name) ||
          i.name.includes(master.normalizedName),
      );

      if (!matched) return null;

      return {
        //栄養判定専用データに変換
        name: i.name,
        nutritionCategory: matched.nutritionCategory,
        vegetableType: matched.vegetableType,
        proteinScore: matched.proteinScore,
      };
    }),
  );
};
