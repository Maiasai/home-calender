//レシピ新規作成　body型

import { RecipeCategory } from '@/generated/prisma';

export type CreatePostRequestBody = {
  //bodyの形
  title: string;
  memo?: string;
  servings?: number;
  thumbnailImageUrl?: string;
  ingredients?: {
    name?: string;
    amount?: number;
    unitId?: string;
  }[];

  steps?: { recipestep: string }[];
  category?: RecipeCategory; //　?　= undefinedが追加される（プリズマの型を追加）
};
