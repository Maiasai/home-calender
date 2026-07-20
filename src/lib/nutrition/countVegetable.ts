//分類した野菜をカウントする関数

import { IngredientItem } from './typs';

export const countVegetable = (vegetables: IngredientItem[]) => {
  return vegetables.reduce(
    (total, vegetable) => {
      if (vegetable.vegetableType === 'GREEN_YELLOW') {
        total.greenAmount += vegetable.amount;
      }
      if (vegetable.vegetableType === 'LIGHT') {
        total.lightAmount += vegetable.amount;
      }
      //次の周のために返すtotal
      return total;
    },
    //初期値（第二引数）
    {
      greenAmount: 0,
      lightAmount: 0,
    },
  );
};
