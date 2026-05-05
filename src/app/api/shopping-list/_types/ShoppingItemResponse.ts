//買い物リスト　レスポンス型

export type ShoppingItemResponse = {
  id: string;
  name: string;
  quantityText: number;
  unitName: string;
  checked: boolean;
  sortOrder: number;
  memo?: string;
};
