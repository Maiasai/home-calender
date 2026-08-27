//URLからレシピ登録型（フロント、API送信型）

import { RecipeIngredientFormPart } from './RecipeFormValues';

export type RecipeCategory = 'MAIN' | 'SIDE' | 'UNCLASSIFIED';

export type CreateRecipeByUrlRequest = RecipeIngredientFormPart & {
  thumbnailImageUrl?: string;
  title: string;
  sourceUrl: string;
  category?: RecipeCategory;
  memo?: string;
};
