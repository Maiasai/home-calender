//カテゴリ型UIフィルター型

import { RecipeCategory } from "generated/prisma";

export type CategoryFilter =
  |""
  |RecipeCategory;
  