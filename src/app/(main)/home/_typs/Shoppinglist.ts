//買い物リスト型

export type Shoppinglist = {
  id: string;
  name: string;
  quantityText: number | null;
  unitName: string | null;
  checked: boolean;
};
