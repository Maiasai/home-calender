import { Meal } from '@/app/(main)/home/_typs/Meal';
import countNutrition from './countNutrition';
import { getIngredients } from './getIngredients';
import judgeLevel from './judgeLevel';
import { BalanceLevel } from './typs';

const calculateNutrition = (menu: Meal) => {
  //①食材取得
  const ingredients = getIngredients(menu);

  //②カウント
  const { proteinCount, vegetableCount } = countNutrition(ingredients);

  //③判定(数字→レベルにする)
  const protein = judgeLevel(proteinCount);
  const vegetable = judgeLevel(vegetableCount);

  //④overall(全体バランス)
  let overall: BalanceLevel;

  if (protein === 'bad' || vegetable === 'bad') {
    overall = 'bad';
  } else if (protein === 'warning' || vegetable === 'warning') {
    overall = 'warning';
  } else {
    overall = 'good';
  }

  return {
    protein,
    vegetable,
    overall,
  };
};

export default calculateNutrition;
