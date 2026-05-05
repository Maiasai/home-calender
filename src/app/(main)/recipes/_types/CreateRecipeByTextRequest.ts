//テキストからレシピ登録型（フロント、API送信型）

export type RecipeCategory = 'MAIN' | 'SIDE' | 'UNCLASSIFIED';

export type CreateRecipeByTextRequest = {
  sourceText: string;
  category?: RecipeCategory;
  memo?: string;
};
