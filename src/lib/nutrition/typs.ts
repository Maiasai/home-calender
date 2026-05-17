//栄養分析　型定義

export type NutritionCategory = 'PROTEIN' | 'VEGETABLE' | 'CARB';

export type vegetableType = 'LIGHT' | 'GREEN_YELLOW';

export type BalanceLevel = 'good' | 'warning' | 'bad';

export type NutritionResult = {
  protein: BalanceLevel;
  vegetable: BalanceLevel;
  overall: BalanceLevel;
};

export type IngredientItem = {
  name: string;
  nutritionCategory: NutritionCategory;
  vegetableType?: vegetableType;
  proteinScore?: number;
};
