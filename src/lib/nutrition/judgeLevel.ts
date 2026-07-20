//材料から栄養に分類したデータを下に、数値 → 状態変換する関数(タンパク質)
//成人女性の目安が約50g、成人男性が約65gなので、
// 50gは「男女平均」というより、成人向けの最低限寄りの共通ラインというイメージ

import { BalanceLevel } from './typs';

const judgeLevel = (proteinCount: number): BalanceLevel => {
  if (proteinCount >= 50) return 'good';
  if (proteinCount >= 25) return 'warning';
  return 'bad';
};

export default judgeLevel;
