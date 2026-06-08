// ここで買い物リストを表示用データに変換

import { Shoppinglist } from '../../home/_typs/Shoppinglist';
import { GroupedItem } from '../_typs/GroupedItem';

export const createGroupedItems = (data: Shoppinglist[]): GroupedItem[] => {
  if (!data) return [];

  const map = new Map<string, GroupedItem>();

  data.forEach((item) => {
    //同じもの判定用ラベル（keyに名前 or id 入れてる）
    const key = item.name.trim() ? item.name : item.id; //名前が空欄だったらidをkeyとする
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
        sortOrder: item.sortOrder ?? 0, //見た目の順番をデータ化したもの
      });
    } else {
      //同じ名前が出た回数
      existing.count += 1;
      existing.totalQuantity += item.quantityText ?? 0;
      existing.sortOrder = Math.min(
        //ここで最初に出てきた位置保持
        existing.sortOrder,

        item.sortOrder ?? 0,
      );
    }
  });
  return Array.from(map.values());
};
