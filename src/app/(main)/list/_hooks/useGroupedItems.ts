// ここで買い物リストを表示用データに変換

import { Shoppinglist } from '../../home/_typs/Shoppinglist';
import { GroupedItem } from '../_typs/GroupedItem';

export const createGroupedItems = (
  data: Shoppinglist[],
  checkedMap: Record<string, boolean>,
): GroupedItem[] => {
  if (!data) return [];

  const map = new Map<string, GroupedItem>();

  data.forEach((item) => {
    const key = item.name; //同じ食材をまとめる基準
    const existing = map.get(key);

    if (!existing) {
      //同じ食材名がなければ初期データ作成
      map.set(key, {
        id: item.id, //代表ID（UI操作用）
        name: item.name,
        unit: item.unit ?? null,
        totalQuantity: item.quantityText ?? 0,
        count: 1,
        checked: item.checked, //買ったかどうか　ture/false
        memo: item.memo ?? '',
        sortOrder: item.sortOrder ?? 0, //見た目の順番をデータ化したもの
      });
    } else {
      //同じ名前が出た回数
      existing.count += 1;
      existing.totalQuantity += item.quantityText ?? 0;
      existing.sortOrder = Math.min(
        existing.sortOrder,

        item.sortOrder ?? 0,
      );
    }
  });
  return Array.from(map.values());
};
