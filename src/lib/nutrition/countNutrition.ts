//食材を栄養に分けてからカウントする関数

import { IngredientItem } from './typs';

const countNutrition = (ingredients: IngredientItem[]) => {
  //タンパク質の食材がいくつあるかカウント(数字が返る)
  const proteinCount = ingredients.filter(
    (i) => i.nutritionCategory === 'PROTEIN',
  ).length;

  //野菜の食材がいくつかあるかカウント(数字が返る)
  const vegetableCount = ingredients.filter(
    (i) => i.nutritionCategory === 'VEGETABLE',
  ).length;

  return {
    proteinCount,
    vegetableCount,
  };
};
export default countNutrition;
