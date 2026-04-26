// src/types/menu.ts

export type ItemType = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
};

export type DayData = {
  id: string;
  breakfast: ItemType[];
  lunch: ItemType[];
  dinner: ItemType[];
};

export type MonthData = {
  [date: string]: DayData;
};
