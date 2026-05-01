//URLからレシピ登録型（フロント、API送信型）

export type RecipeCategory = 'MAIN' | 'SIDE' | 'UNCLASSIFIED';

export type CreateRecipeByUrlRequest = {
  title: string;
  sourceUrl: string;
  category?: RecipeCategory;
  memo?: string;
};
