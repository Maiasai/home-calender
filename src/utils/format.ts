// 画面ごとのレシピ名　長さ

import { truncate } from './string';

//レシピ一覧画面
export const RecipeListTitle = (text: string) => truncate(text, 6);

//献立レシピ選択画面
export const truncateRecipeListTitle = (text: string) => truncate(text, 5);

//献立作成、カスタマイズ画面
export const truncateRecipeTitle = (text: string) => truncate(text, 14);

//ニックネーム
export const truncateNickName = (text: string) => truncate(text, 8);
