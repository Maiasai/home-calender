import { Meal } from '@/app/(main)/home/_typs/Meal';
import { getIngredients } from './getIngredients';
import judgeLevel from './judgeLevel';
import { BalanceLevel, IngredientItem } from './typs';
import { countVegetable } from './countVegetable';
import judgeVegetableLevel from './judgeVegetableLevel';
import { splitEnergyFoods } from './splitProtein';
import { countProtein } from './countProtein';

const calculateNutrition = (menu: Meal) => {
  //①食材取得
  const ingredients = getIngredients(menu);

  const ingredientsNotNull = ingredients.filter(
    (i): i is IngredientItem => i !== null,
  );

  //タンパク質と野菜に分けてをさらに細かくする
  //＜タンパク質＞
  const proteins = splitEnergyFoods(ingredientsNotNull);

  //＜野菜＞
  const { greenAmount, lightAmount } = countVegetable(ingredientsNotNull);

  //カウント
  const proteinCount = countProtein(proteins);

  //③判定(数字→レベルにする)
  const protein = judgeLevel(proteinCount);
  const vegetable = judgeVegetableLevel({ greenAmount, lightAmount });

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
