//買い物リスト　並び替え　リクエスト型

export type SortItems = {
  items: ItemType[];
};

export type ItemType = {
  id: string;
  sortOrder: number;
};
