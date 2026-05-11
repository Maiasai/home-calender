//買い物リストデータ　UI専用型

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
  memo: string;
  sortOrder: number;
};
