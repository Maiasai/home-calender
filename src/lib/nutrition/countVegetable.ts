//分類した野菜をカウントする関数

import { IngredientItem } from './typs';

export const countVegetable = (vegetables: IngredientItem[]) => {
  return vegetables.length;
};
