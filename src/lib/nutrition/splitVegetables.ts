//野菜をさらに分類する関数

import { IngredientItem } from './typs';

export const splitVegetables = (item: IngredientItem[]) => {
  const vegetable = item.filter((i) => i.nutritionCategory === 'VEGETABLE');

  const greenYellow = vegetable.filter(
    (v) => v.vegetableType === 'GREEN_YELLOW',
  );
  const light = vegetable.filter((v) => v.vegetableType === 'LIGHT');

  return {
    greenYellow,
    light,
  };
};
