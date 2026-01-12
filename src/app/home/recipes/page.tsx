//レシピ一覧ページ

"use client";


type RecipeListItem = { //レシピ一件のデータ構造
  id : string;
  title : string;
  category : string;
  sourceType : string;
  thumbnailUrl : string | null;
  updatedAt : string;
};

type RecipesResponse = { //apiが返すJSONの構造
  recipies : RecipeListItem[];
};

