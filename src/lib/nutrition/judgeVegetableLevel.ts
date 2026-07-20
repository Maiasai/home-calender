//野菜用　レベル判定
//厚生労働省の「健康日本21（第三次）」では、成人の野菜摂取量の目標を1日350gとしている
//野菜全体：350g以上
//そのうち緑黄色野菜：120g以上

import { BalanceLevel } from './typs';

type CountType = {
  greenAmount: number;
  lightAmount: number;
};

const judgeVegetableLevel = ({
  greenAmount,
  lightAmount,
}: CountType): BalanceLevel => {
  const totalAmount = greenAmount + lightAmount;

  if (totalAmount >= 350 && greenAmount >= 120) return 'good';
  if (totalAmount >= 200 && greenAmount >= 70) return 'warning';
  return 'bad';
};

export default judgeVegetableLevel;
