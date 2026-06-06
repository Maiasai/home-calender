//買い物リスト

'use client';
import { fetcher } from '@/lib/featcher';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Shoppinglist } from '../home/_typs/Shoppinglist';
import Image from 'next/image';
import { UpdateShoppingData } from '@/app/api/shopping-list/_types/UpdateShoppingData';
import { GetUnitsResponse, UnitData } from '@/app/api/units/route';
import { createGroupedItems } from './_hooks/useGroupedItems';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from './_components/SortableItem';
import { GroupedItem } from './_typs/GroupedItem';
import { useSupabaseSession } from '../home/_hooks/useSupabaseSession';
import PrimaryButton from '@/components/button/PrimaryButton';
import { Loading } from '@/components/Loading';
import { Empty } from '@/components/Empty';
import { ErrorMessage } from '@/components/ErrorMessage';

const List = () => {
  const { token } = useSupabaseSession();

  const [units, setUnits] = useState<UnitData[]>([]);
  const [groupedItems, setGroupedItems] = useState<GroupedItem[]>([]);

  //メモ）mutate→最新データを再取得（サーバーと再同期）
  //メモ）onBlur→入力欄からフォーカスが外れた瞬間に発火するイベント
  const { data, mutate, isLoading, error } = useSWR<Shoppinglist[]>(
    '/api/shopping-list/from-menu',
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

  //nameごとにここでグループ化
  useEffect(() => {
    if (!data) return;
    setGroupedItems(createGroupedItems(data, {}));
  }, [data]);

  //ドラッグイベント追加
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = groupedItems.findIndex((i) => i.id === active.id);
    const newIndex = groupedItems.findIndex((i) => i.id === over.id);

    const newItems = arrayMove(groupedItems, oldIndex, newIndex);

    const updated = newItems.map((item, index) => ({
      ...item,
      sortOrder: index,
    }));

    //UI更新
    setGroupedItems(updated);
    // API保存
    saveSortOrder(updated);
  };

  //API
  const saveSortOrder = async (items: GroupedItem[]) => {
    await fetch('/api/shopping-list/sort-order', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: items.map((i) => ({
          id: i.id,
          sortOrder: i.sortOrder,
        })),
      }),
    });
    mutate();
  };

  //update関数
  const updateItem = async (
    id: string,
    body: Omit<UpdateShoppingData, 'id'>,
  ) => {
    await fetch('/api/shopping-list/from-menu', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id,
        ...body,
      }),
    });

    mutate();
  };

  //追加処理
  const addItem = async () => {
    try {
      const res = await fetch('/api/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: '',
          quantityText: 1,
          unitId: null,
        }),
      });
      if (!res.ok) {
        throw new Error('追加に失敗しました');
      }
      mutate();
    } catch (error) {
      console.log(error);
      alert('エラーが発生しました');
    }
  };

  //削除処理（単体）
  const deleateItem = async (id: string) => {
    await fetch('/api/shopping-list/from-menu', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    mutate();
  };

  //削除処理
  const deleateItems = async (items: GroupedItem[]) => {
    await fetch('/api/shopping-list/from-menu', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    });
    mutate();
  };

  if (isLoading) return <Loading />;
  if (!data) return <Empty />;
  if (error) return <ErrorMessage />;

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex justify-center border-b-2 max mb-4">
        買い物リスト
      </nav>

      <div className=" rounded-3xl md:p-2 min-h-[500px] bg-[#FAF7F2] p-2">
        <button
          onClick={() => {
            if (confirm('削除すると元に戻せません。本当に削除しますか？')) {
              deleateItems(groupedItems);
            }
          }}
          className="flex items-center text-[#e95c5c] font-bold mb-6 ml-2 bg-white shadow-md rounded-lg p-2 m-2"
        >
          <Image
            src="/images/delete_50dp.png"
            alt="削除"
            width={20}
            height={20}
          />
          <p className="mx-1 text-sm">全削除</p>
        </button>

        <div className="flex flex-col justify-between items-center mb-4 p-1">
          {/* リスト */}
          <div className="w-full mx-auto max-w-sm md:max-w-3xl bg-white rounded-lg shadow-md overflow-hidden">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={groupedItems.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {groupedItems.map((item) => (
                  <SortableItem key={item.id} item={item}>
                    {(listeners) => (
                      <div
                        className={`w-full flex items-center p-2 border-b last:border-none transition ${
                          item.checked ? 'opacity-40' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between w-full">
                          <div className="min-w-0 flex-1">
                            {/* 削除アイコン */}
                            <div className="flex w-full items-center gap-1 md:gap-2 min-w-0">
                              <button
                                className="shrink-0"
                                onClick={() => deleateItem(item.id)}
                              >
                                <Image
                                  src="/images/close_24dp.png"
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
                                  updateItem(item.id, {
                                    checked: !item.checked,
                                  });
                                }}
                                className={`w-6 h-6 rounded-full border flex items-center justify-center
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
                              <input
                                className="flex-1  min-w-0 max-w-[140px] md:max-w-[220px] pl-2 border border-gray-300 rounded-lg p-1"
                                disabled={item.checked}
                                defaultValue={item.name}
                                onBlur={(e) =>
                                  updateItem(item.id, {
                                    name: e.currentTarget.value,
                                  })
                                }
                              />
                              {/* 数量 */}
                              <input
                                type="number"
                                className="w-12 md:w-20 px-2 border border-gray-300 rounded-lg p-1"
                                disabled={item.checked}
                                defaultValue={item.totalQuantity}
                                onBlur={(e) => {
                                  const value = e.currentTarget.value;
                                  {
                                    /* currentTargetはイベントを書いた要素を指定。※currentTarget.valueにより、onBlurを書いたinput自身から入力された値が取れる */
                                  }
                                  const parsed = Number(value);
                                  {
                                    /* ここで入力された値を数字に変換 */
                                  }
                                  if (Number.isNaN(parsed)) return;

                                  updateItem(item.id, {
                                    quantityText: parsed,
                                  });
                                }}
                              />
                              <select
                                className="w-17 h-9 px-2 border border-gray-300 rounded-lg"
                                disabled={item.checked}
                                value={item.unit?.id ?? ''} //ここで最初に何を表示するか指定＊このValueはoptionのvalueから来ている
                                onChange={(
                                  //！「e」の中にイベント「発生元：target」「登録元：currentTarget」両方が入ってる。子要素で発生したイベントを親でも受け取れるようにするために2つ存在してる。
                                  // ※　target = 実際にイベントが発生した要素//currentTarget = イベントを書いた要素
                                  // その中それぞれに変更されたvalueが入ってる
                                  //　→発火したらReactがこのイベント情報「e」を作って送ってくる
                                  e,
                                ) =>
                                  //表示上はunit.nameだが、DBに保存したいのはunit.idのためこの書き方になる
                                  //item.id→shoppingItemのid
                                  updateItem(item.id, {
                                    unitId: e.currentTarget.value, //"選択された単位のuuid"
                                    //target.valueにすると子要素が多い時イベントがどこから飛んできたのか分かりずらいが、currentTarget.valueにすることで確実に
                                    //イベントがどこから飛んできたのかわかりやすくできるメリットがある
                                  })
                                }
                              >
                                <option value="">未選択</option>

                                {units.map((unit) => (
                                  <option key={unit.id} value={unit.id}>
                                    {unit?.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div
                            {...listeners}
                            className="shrink-0 cursor-grab ml-3 mr-1 mt-1"
                          >
                            <Image
                              src="/images/Sort_50dp.png"
                              alt="並び替えアイコン"
                              width={30}
                              height={30}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>

          <PrimaryButton
            className="w-[148px] h-[30px] mt-10"
            onClick={addItem}
            variant="primary"
          >
            ＋追加
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default List;
