//買い物リスト　body型(更新)

export type UpdateShoppingData = {
  id: string;
  name?: string;
  quantityText?: number;
  unitName?: string;
  memo?: string;
  checked?: boolean;
  unitId?: string | null;
};
