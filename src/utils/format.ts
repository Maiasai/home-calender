// 画面ごとのレシピ名　長さ

import { truncate } from './string';

// カレンダー用（短め）
export const truncateCalendarTitle = (text: string) => truncate(text, 5);

//献立レシピ選択画面
export const truncateRecipeListTitle = (text: string) => truncate(text, 7);

//献立作成、カスタマイズ画面
export const truncateRecipeTitle = (text: string) => truncate(text, 15);
