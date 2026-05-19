//分類したタンパク質をカウントする関数

import { IngredientItem } from './typs';

export const countProtein = (protein: IngredientItem[]) => {
  //引数から一つづつ取り出して、単位で分けて計算
  const data = protein.map((d) => {
    const unitname = d.unitId?.name;
    const score = d.proteinScore ?? 0;

    if (unitname === 'g') return (d.amount * score) / 100;
    if (unitname === '個') return d.amount * score;
    if (unitname === 'パック') return d.amount * score;
    if (unitname === '切れ') return (d.amount * 100 * score) / 100;
    if (unitname === '尾') return (d.amount * 150 * score) / 100;

    //どの if にも一致しなかった時だけ実行
    return 0;
  });

  //sum→今までの合計、item→今見てる1個
  //配列の数だけ繰り返してる
  const pScore = data.reduce(
    (sum, item) => sum + (item ?? 0),
    0, //この0は初期値
  );

  return pScore;
};
