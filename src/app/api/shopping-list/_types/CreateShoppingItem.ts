//買い物リスト追加　body型

import { ShoppingItemType } from '@/generated/prisma';

export type CreateShoppingItem = {
  name: string;
  quantityText?: number;
  unitId?: string | null;
  itemType: ShoppingItemType;
};
