//買い物リスト　レスポンス型

export type ShoppingItemResponse = {
  id: string;
  name: string;
  quantityText: number;
  unitId: string | null;
  checked: boolean;
  sortOrder: number;
  unit: {
    id: string;
    name: string;
  } | null;
};
