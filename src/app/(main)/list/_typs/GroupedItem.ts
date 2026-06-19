//買い物リストデータ　UI専用型

import { ShoppingItemType } from '@/generated/prisma';

export type GroupedItem = {
  id: string;
  name: string;
  unit: {
    id: string;
    name: string;
  } | null;
  totalQuantity: number;
  count: number;
  checked: boolean;
  sortOrder: number;
  itemType: ShoppingItemType;
};
