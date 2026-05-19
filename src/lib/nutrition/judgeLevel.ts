//材料から栄養に分類したデータを下に、数値 → 状態変換する関数(タンパク質)

import { BalanceLevel } from './typs';

const judgeLevel = (proteinCount: number): BalanceLevel => {
  if (proteinCount >= 50) return 'good';
  if (proteinCount >= 25) return 'warning';
  return 'bad';
};

export default judgeLevel;
