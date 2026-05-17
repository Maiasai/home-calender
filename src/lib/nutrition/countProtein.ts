//分類したタンパク質をカウントする関数

import { IngredientItem } from './typs';

export const countProtein = (protein: IngredientItem[]) => {
  //sum→今までの合計、item→今見てる1個
  //配列の数だけ繰り返してる
  const pScore = protein.reduce(
    (sum, item) => sum + (item.proteinScore ?? 0),
    0, //この0は初期値
  );

  return pScore;
};
