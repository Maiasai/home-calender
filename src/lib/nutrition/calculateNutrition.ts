import { Meal } from '@/app/(main)/home/_typs/Meal';
import countNutrition from './countNutrition';
import { getIngredients } from './getIngredients';
import judgeLevel from './judgeLevel';
import { BalanceLevel, IngredientItem } from './typs';

const calculateNutrition = (menu: Meal) => {
  //①食材取得
  const ingredients = getIngredients(menu);

  const ingredientsNotNull = ingredients.filter(
    (i): i is IngredientItem => i.nutritionCategory !== null,
  );

  //②カウント
  const { proteinCount, vegetableCount } = countNutrition(ingredientsNotNull);

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
