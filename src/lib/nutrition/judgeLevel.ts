//材料から栄養に分類したデータを下に、数値 → 状態変換する関数

import { BalanceLevel } from './typs';

const judgeLevel = (count: number): BalanceLevel => {
  if (count >= 2) return 'good';
  if (count >= 1) return 'warning';
  return 'bad';
};

export default judgeLevel;
