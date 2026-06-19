//買い物リスト　レスポンス型

import { ShoppingItemType } from '@/generated/prisma';

export type ShoppingItemResponse = {
  id: string;
  name: string;
  quantityText: number | null;
  unitId: string | null;
  checked: boolean | null;
  sortOrder: number;
  unit: {
    id: string;
    name: string;
  } | null;
  itemType: ShoppingItemType;
};
