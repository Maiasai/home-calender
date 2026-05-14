//献立分類（フロント用）

import { MealType } from '@/generated/prisma';

export type UiMealType = MealType | 'UNSELECTED';
