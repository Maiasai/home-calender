//買い物リスト追加　body型

export type CreateShoppingItem = {
  name: string;
  quantityText?: number;
  unitId?: string | null;
};
