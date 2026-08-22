//献立id 型定義

export type MealId = {
  id: string;
};

//献立個別削除用id 型定義
export type MealRecipeId = string;

//APIに送るリクエスト型
export type DeleteMealRecipeBody = {
  id: MealRecipeId;
};
