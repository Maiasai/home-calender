//食材を集める関数
//menu から ingredient 一覧だけ取り出す

import { Meal } from '@/app/(main)/home/_typs/Meal';
import { ingredientsData } from '@/../prisma/seeds/ingredients';
import { IngredientItem } from './typs';

export const getIngredients = (meal: Meal): (IngredientItem | null)[] => {
  if (!meal) return [];

  return meal.recipes.flatMap((r) => {
    const servings =
      r.recipe.servings != null && r.recipe.servings > 0
        ? r.recipe.servings
        : 1;

    return (r.recipe.ingredients ?? []).map((i) => {
      const matched = ingredientsData.find((master) =>
        master.aliases.some((alias) => i.name.includes(alias)),
      );

      // // 栄養マスタにない材料は除外
      if (!matched) return null;

      // 数量が登録されていない材料は除外
      if (i.amount == null) return null;

      const unitName = i.unit?.name;

      if (!unitName) return null;

      let amountInGrams: number;

      if (unitName === 'g') {
        amountInGrams = i.amount;
      } else if (unitName === 'kg') {
        amountInGrams = i.amount * 1000;
      } else {
        const gramsPerUnit = matched.unitConversions?.[unitName];

        if (gramsPerUnit == null) {
          return null;
        }
        amountInGrams = i.amount * gramsPerUnit;
      }
      const amountPerServing = amountInGrams / servings;

      return {
        //栄養判定専用データに変換
        //レシピ側
        name: i.name,
        amount: amountPerServing,
        unitId: i.unit,

        //辞書側
        nutritionCategory: matched.nutritionCategory,
        vegetableType: matched.vegetableType,
        proteinScore: matched.proteinScore,
      };
    });
  });
};
