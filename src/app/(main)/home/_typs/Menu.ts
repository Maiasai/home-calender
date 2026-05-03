// src/types/menu.ts

import { MealId } from './MealId';

export type ItemType = {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  ingredients?: ItemIngredient[];
};

export type DayData = {
  id: MealId;
  breakfast: ItemType[];
  lunch: ItemType[];
  dinner: ItemType[];
};

export type MonthData = {
  [date: string]: DayData;
};

export type ItemIngredient = {
  id: string;
  name: string;
  amount?: number;
  unit?: string;
};
