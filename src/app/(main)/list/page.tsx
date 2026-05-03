//買い物リスト

'use client';
import { fetcher } from '@/lib/featcher';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Shoppinglist } from '../home/_typs/Shoppinglist';
import Image from 'next/image';
import { GetUnitsResponse, UnitData } from '@/shared/types/unit';
import { UpdateShoppingData } from '@/app/api/shopping-list/_types/UpdateShoppingData';

const List = () => {
  //チェック状態を保存
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [units, setUnits] = useState<UnitData[]>([]);

  const { data, mutate, isLoading } = useSWR<Shoppinglist[]>(
    '/api/shopping-list',
    fetcher,
  );
  //単位取得用
  useEffect(() => {
    const fetchUnits = async () => {
      const res = await fetch('/api/units');
      const data: GetUnitsResponse = await res.json();
      setUnits(data.units);
    };

    fetchUnits();
  }, []);

  // grouped + checked をUI用に変換
  const groupedItems = React.useMemo(() => {
    //useMemo→値が変わった時だけ再計算
    if (!data) return [];

    //newMap()→キーと値をセットで保存する箱
    //→forEachしながらこの箱に中身が追加されていく
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        unitName: string;
        totalQuantity: number;
        count: number;
        checked: boolean;
        memo: string;
        sortOrder: number;
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
          id: item.id,
          name: item.name,
          unitName: item.unitName ?? '',
          totalQuantity: item.quantityText ?? 0,
          count: 1,
          checked: false,
          memo: item.memo ?? '',
          sortOrder: item.sortOrder ?? 0,
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

  //update関数
  const updateItem = async (
    id: string,
    body: Omit<UpdateShoppingData, 'id'>,
  ) => {
    await fetch('/api/shopping-list', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        ...body,
      }),
    });

    mutate();
  };

  //削除処理
  const deleateItem = async (id: string) => {
    await fetch('/api/shopping-list', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    mutate();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex justify-center border-b-2 max mb-4">
        買い物リスト
      </nav>

      <div className=" rounded-3xl p-5 min-h-[500px]">
        <div className="flex flex-col justify-between items-center mb-4">
          {/* 買い物リスト */}
          {data?.length === 0 && (
            <div className="text-center mt-10">
              該当の買い物リストがありませんでした
            </div>
          )}

          {/* リスト */}
          <div className=" w-full max-w-xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
            {sortedItems.map((item) => (
              <div
                key={item.name}
                className={`w-full flex items-center px-4 py-4 border-b last:border-none transition ${
                  item.checked ? 'opacity-40' : 'hover:bg-gray-50'
                }`}
              >
                <button
                  className="mr-3 shrink-0"
                  onClick={() => deleateItem(item.id)}
                >
                  <Image
                    src="/images/Frame174.png"
                    alt="削除アイコン"
                    width={20}
                    height={20}
                  />
                </button>
                {/* チェック */}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCheck(item.name);
                  }}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3
                    ${
                      item.checked
                        ? 'bg-orange-400 border-orange-400'
                        : 'bg-white border-gray-300'
                    }`}
                >
                  {item.checked && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </button>

                {/* テキスト（左揃え） */}
                {/* 品名 */}
                <div className="flex flex-1 items-center gap-3 min-w-0">
                  <input
                    className="flex-1 min-w-0 px-2 outline-none"
                    disabled={item.checked}
                    defaultValue={item.name}
                    onBlur={(e) =>
                      updateItem(item.id, {
                        name: e.target.value,
                      })
                    }
                  />

                  {/* 数量 */}
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      className="w-12 text-right outline-none"
                      disabled={item.checked}
                      defaultValue={item.totalQuantity}
                      onBlur={(e) =>
                        updateItem(item.id, {
                          quantityText: Number(e.target.value),
                        })
                      }
                    />
                    <select
                      className="flex justify-center w-28 outline-none bg-transparent"
                      disabled={item.checked}
                      defaultValue={item.unitName}
                      onChange={(e) =>
                        updateItem(item.id, {
                          unitName: e.target.value,
                        })
                      }
                    >
                      {units.map((unit) => (
                        <option key={unit.id} value={unit.name}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    defaultValue={item.memo}
                    placeholder="メモ"
                    onBlur={(e) =>
                      updateItem(item.id, {
                        memo: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="ml-3 shrink-0 cursor-grab">
                  <Image
                    src="/images/Sort_50dp.png"
                    alt="並び替えアイコン"
                    width={30}
                    height={30}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
