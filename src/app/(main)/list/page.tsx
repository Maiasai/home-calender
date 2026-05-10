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

const List = () => {
  const [units, setUnits] = useState<UnitData[]>([]);

  //メモ）mutate→最新データを再取得（サーバーと再同期）
  //メモ）onBlur→入力欄からフォーカスが外れた瞬間に発火するイベント
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

  //nameごとにここでグループ化
  const groupedItems = createGroupedItems(data ?? [], {});

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

    // API保存
    saveSortOrder(updated);
  };

  //API
  const saveSortOrder = async (items: GroupedItem[]) => {
    await fetch('/api/shopping-list/sort-order', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
                            updateItem(item.id, {
                              checked: !item.checked,
                            });
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
                            className="flex-1 min-w-0 px-2 border border-gray-300 rounded-lg"
                            disabled={item.checked}
                            defaultValue={item.name}
                            onBlur={(e) =>
                              updateItem(item.id, {
                                name: e.currentTarget.value,
                              })
                            }
                          />

                          {/* 数量 */}
                          <div className="flex items-center gap-1 shrink-0">
                            <input
                              type="number"
                              className="w-12 px-2 border border-gray-300 rounded-lg"
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
                              className="w-18 h-6 px-2 border border-gray-300 rounded-lg"
                              disabled={item.checked}
                              defaultValue={item.unit?.id ?? ''} //ここで最初に何を表示するか指定＊このValueはoptionのvalueから来ている
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
                              {units.map((unit) => (
                                <option key={unit.id} value={unit.id}>
                                  {unit?.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <input
                            className="px-2 border border-gray-300 rounded-lg"
                            defaultValue={item.memo}
                            placeholder="メモ"
                            onBlur={(e) =>
                              updateItem(item.id, {
                                memo: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div
                          {...listeners}
                          className="ml-3 shrink-0 cursor-grab"
                        >
                          <Image
                            src="/images/Sort_50dp.png"
                            alt="並び替えアイコン"
                            width={30}
                            height={30}
                          />
                        </div>
                      </div>
                    )}
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
