//買い物リスト型（フロント用）

import { ShoppingItemType } from '@/generated/prisma';

export type Shoppinglist = {
  id: string;
  name: string;
  quantityText: number | null;
  unitName: string | null;
  checked: boolean;
  sortOrder: number;
  unit: {
    id: string;
    name: string;
  } | null;
  itemType: ShoppingItemType;
};
