//レシピ詳細　型定義

import { RecipeCategory } from '@/generated/prisma';

export type RecipeDetail = {
  id: string;
  title: string;
  memo: string | null;

  sourceType: 'URL' | 'MANUAL' | 'TEXT';
  sourceUrl: string | null;

  servings: number;
  thumbnailUrl: string | null;
  category: RecipeCategory;
  updatedAt: string;

  recipeIngredients: {
    id: string;
    quantityText: number;
    ingredient: {
      name: string;
    };
    unit: {
      id: string;
      name: string;
    };
  }[];

  recipeSteps: {
    id: string;
    instructionText: string;
    stepNumber: number;
  }[];
};
