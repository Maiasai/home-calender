//買い物リスト型（フロント用）

export type Shoppinglist = {
  id: string;
  name: string;
  quantityText: number | null;
  unitName: string | null;
  checked: boolean;
  memo?: string;
  sortOrder: number;
  unit: {
    id: string;
    name: string;
  } | null;
};
