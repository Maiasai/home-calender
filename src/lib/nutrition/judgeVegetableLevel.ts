//野菜用　レベル判定

import { BalanceLevel } from './typs';

type CountType = {
  greenCount: number;
  lightCount: number;
};

const judgeVegetableLevel = ({
  greenCount,
  lightCount,
}: CountType): BalanceLevel => {
  if (greenCount >= 2 && lightCount >= 3) return 'good';
  if (greenCount >= 1 || lightCount >= 2) return 'warning';
  return 'bad';
};

export default judgeVegetableLevel;
