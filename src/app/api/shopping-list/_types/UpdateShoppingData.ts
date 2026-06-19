//買い物リスト　body型(更新)
//?はDBに送らなくてもOK！　|nullは送るならnullもOK！
//id,name,checked,itemTypeはDB側では必須にしてるから|nullとは書かない

import { ShoppingItemType } from '@/generated/prisma';

export type UpdateShoppingData = {
  id: string;
  name?: string;
  quantityText?: number | null;
  unitName?: string | null;
  checked?: boolean;
  unitId?: string | null;
  itemType?: ShoppingItemType;
};
