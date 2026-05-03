//レシピデータと検索関連の型定義

import { RecipeCategory } from 'generated/prisma';

//useSWRで使っている型
export interface RecipeData {
  //APIのクエリパラメーター名
  id: string;
  thumbnailUrl?: string;
  title: string;
  userRecipeStatus?: {
    isFavorite: boolean;
    hasCooked: boolean;
  }[];
  category: RecipeCategory;
}

export type Filters = {
  keyword?: string;
  category?: string;
  favorite?: boolean;
  cooked?: boolean;
};
