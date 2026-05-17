//食材のまとまりから、タンパク質をさらに分類する関数

import { IngredientItem } from './typs';

export const splitEnergyFoods = (item: IngredientItem[]) => {
  const protein = item.filter(
    (i) => i.nutritionCategory === 'PROTEIN' || i.nutritionCategory === 'CARB',
  );

  return protein;
};
