//買い物リスト

'use client';
import RecipeEditButton from '@/app/components/image/RecipeEditButton';
import { fetcher } from '@/lib/featcher';
import React, { useState } from 'react';
import useSWR from 'swr';
import { Shoppinglist } from '../home/_typs/Shoppinglist';

const List = () => {
  //チェック状態を保存
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  const { data, mutate, isLoading } = useSWR<Shoppinglist[]>(
    '/api/shopping-list',
    fetcher,
  );

  console.log(data);

  // grouped + checked をUI用に変換
  const groupedItems = React.useMemo(() => {
    //useMemo→値が変わった時だけ再計算
    if (!data) return [];

    //newMap()→キーと値をセットで保存する箱
    //→forEachしながらこの箱に中身が追加されていく
    const map = new Map<
      string,
      {
        name: string;
        unitName: string;
        totalQuantity: number;
        count: number;
        checked: boolean;
      }
    >();

    data.forEach((item) => {
      //forEachで回ってきた item.name を使って
      //Mapの中から既存データを探して existing に入れてる
      const existing = map.get(item.name);

      if (existing) {
        //同じ名前が来たらここでカウント増やす
        existing.count += 1;
        existing.totalQuantity += item.quantityText ?? 0;
      } else {
        //初めてきた食材であればここに入る
        //item.name→forEachで回ってきた,今見てる1件のデータのname
        map.set(item.name, {
          name: item.name,
          unitName: item.unitName ?? '',
          totalQuantity: item.quantityText ?? 0,
          count: 1,
          checked: false,
        });
      }
    });

    //Array.from()→ここでいう()内iterable（順番に1個ずつ取り出せるデータ）を配列に変換する
    //map.values()→mapの値だけ全部くださいという意味＊ここではこの値をArryformで配列に変換
    return Array.from(map.values()).map((item) => ({
      ...item,
      checked: checkedMap[item.name] ?? false, //今あるデータにチェックを追加
    }));
  }, [data, checkedMap]);

  //ソートロジック
  const sortedItems = [...groupedItems].sort((a, b) => {
    return Number(a.checked) - Number(b.checked);
  });

  //チェック切り替え
  //※押した材料名(name)を使って、checkedMap全体(prev)の中からその材料だけ反転している
  const toggleCheck = (name: string) => {
    setCheckedMap((prev) => ({
      //prevにその時点の checkedMap 全体が入る
      ...prev, //今までの状態を全てコピー
      [name]: !prev[name],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex justify-center border-b-2 max mb-4">
        買い物リスト
      </nav>
      <div className="flex justify-end">
        <button>
          <RecipeEditButton />
        </button>
      </div>

      {/* 買い物リスト */}
      {data?.length === 0 && (
        <div className="text-center mt-10">
          該当の買い物リストがありませんでした
        </div>
      )}
      <div className="flex justify-center mt-8">
        <div className="w-[400px]">
          {sortedItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-start border-b py-3"
            >
              {/* チェック */}
              <button
                onClick={() => toggleCheck(item.name)}
                className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3
            ${
              item.checked
                ? 'bg-orange-400 border-orange-400'
                : 'bg-white border-gray-300'
            }`}
              >
                {item.checked && <span className="text-white text-sm">✓</span>}
              </button>

              {/* テキスト（左揃え） */}
              <div className="text-left">{item.name}</div>
              <div className="ml-4">
                {item.totalQuantity}
                {item.unitName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
