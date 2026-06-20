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
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

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
    setGroupedItems(createGroupedItems(data));
  }, [data]);

  //ドラッグイベント追加
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return; //どのアイテムの上にも乗らずにドラッグ終了したら何もしない
    if (active.id === over.id) return;

    //ドラッグが終わるとこの２行が動く
    const oldIndex = groupedItems.findIndex((i) => i.id === active.id); //掴んで動かした行のid
    const newIndex = groupedItems.findIndex((i) => i.id === over.id); //最後に重なった行のid

    //groupedItems の oldIndex 番目を、newIndex 番目に移動した新しい配列を作る
    const newItems = arrayMove(groupedItems, oldIndex, newIndex); //配列の順番を入れ替えてる。

    //ここで番号を振り直している
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
    body: Omit<UpdateShoppingData, 'id'>, //UpdateShoppingDataからidだけ除外した型という意味
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

  //追加処理（通常アイテム）
  const addItem = async () => {
    try {
      const res = await fetch('/api/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemType: 'ITEM',
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

  //追加処理（ラベルアイテム）
  const addLabel = async () => {
    try {
      const res = await fetch('/api/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemType: 'LABEL',
          name: '',
          quantityText: null,
          unitId: null,
        }),
      });
      if (!res.ok) {
        throw new Error('ラベル追加に失敗しました');
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

  //スマホでも反応しやすいよう設定
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
  );

  if (isLoading) return <Loading />;
  if (!data) return <Empty />;
  if (error) return <ErrorMessage />;

  return (
    <div className="max-w-3xl mx-auto h-full overflow-hidden flex flex-col">
      <nav className="flex justify-center border-b-2 max mb-4">
        買い物リスト
      </nav>

      <div className="rounded-3xl md:p-2 flex flex-col flex-1 min-h-0 overflow-hidden bg-[#FAF7F2] p-2 ">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <div className="ml-2">
              <PrimaryButton
                className="w-[60px] h-[30px]"
                onClick={addItem}
                variant="primary"
              >
                ＋追加
              </PrimaryButton>
            </div>
            <div className="flex justify-center">
              <PrimaryButton
                className="w-[100px] h-[30px]"
                onClick={addLabel}
                variant="primary"
              >
                ＋ラベル追加
              </PrimaryButton>
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm('削除すると元に戻せません。本当に削除しますか？')) {
                deleateItems(groupedItems);
              }
            }}
            className="flex items-center text-[#e95c5c] font-bold ml-2 bg-white shadow-md rounded-sm mr-4"
          >
            <Image
              src="/images/delete_24dp_red.png"
              alt="削除"
              width={20}
              height={20}
            />
            一括
          </button>
        </div>

        <div className="mt-3 flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <div className="flex flex-col items-center p-1">
            <div className="w-full mx-auto max-w-sm md:max-w-3xl bg-white rounded-lg shadow-md overflow-hidden  my-4">
              {groupedItems.length === 0 && (
                <p className="p-8 flex justify-center">
                  買い物リストがありません
                </p>
              )}
              {/* リスト */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                {/* このid達を並び替え対象にしてとdnd-kitに伝えてる */}
                <SortableContext
                  items={groupedItems.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {/* 1行ずつここで並び替え可能な部品に変換 */}
                  {groupedItems.map((item) => (
                    <SortableItem key={item.id} item={item}>
                      {/* listeners が「この部分を掴んだらドラッグ開始していいよ」という設定 */}
                      {(listeners) =>
                        item.itemType === 'LABEL' ? (
                          <div className="flex justify-between w-full p-2 bg-orange-100">
                            {/* 削除アイコン */}
                            <div className="flex w-full items-center gap-1 md:gap-2">
                              <div className="flex-1">
                                {/* テキスト（左揃え） */}
                                {/* ラベル名 */}
                                <input
                                  className="w-full max-w-[500px] md:max-w-[600px] pl-2 border border-gray-300 rounded-lg p-1"
                                  defaultValue={item.name}
                                  onBlur={(e) =>
                                    updateItem(item.id, {
                                      name: e.currentTarget.value,
                                    })
                                  }
                                />
                              </div>
                              {/* このdivをつかんだらドラッグ開始できるという意味 */}
                              <button
                                className="shrink-0"
                                onClick={() => deleateItem(item.id)}
                              >
                                <Image
                                  src="/images/delete_24dp_black.png"
                                  alt="削除アイコン"
                                  width={20}
                                  height={20}
                                />
                              </button>
                              <div
                                {...(listeners ?? {})}
                                onContextMenu={(e) => e.preventDefault()}
                                className="shrink-0 cursor-grab mt-1 ml-3 touch-none"
                                style={{
                                  WebkitTouchCallout: 'none',
                                  WebkitUserSelect: 'none',
                                  userSelect: 'none',
                                }}
                              >
                                <Image
                                  src="/images/Sort_50dp.png"
                                  alt="並び替えアイコン"
                                  width={30}
                                  height={30}
                                  draggable={false}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`w-full flex items-center p-2 border-b last:border-none transition ${
                              item.checked ? 'opacity-40' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between w-full">
                              <div className="min-w-0 flex-1">
                                {/* 削除アイコン */}
                                <div className="flex w-full items-center gap-1 md:gap-2 min-w-0">
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
                                      <span className="text-white text-sm">
                                        ✓
                                      </span>
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
                              <button
                                className="shrink-0"
                                onClick={() => deleateItem(item.id)}
                              >
                                <Image
                                  src="/images/delete_24dp_black.png"
                                  alt="削除アイコン"
                                  width={20}
                                  height={20}
                                  className="ml-2"
                                />
                              </button>

                              <div
                                {...(listeners ?? {})}
                                onContextMenu={(e) => e.preventDefault()} //スマホ長押しや右クリック時のメニューを出さないようにしてる。
                                className="shrink-0 cursor-grab ml-4 mt-1 touch-none"
                                style={{
                                  //スマホ長押しで画像保存メニューが出たり、文字選択されたりするのを防ぐため。
                                  WebkitTouchCallout: 'none',
                                  WebkitUserSelect: 'none',
                                  userSelect: 'none',
                                }}
                              >
                                <Image
                                  src="/images/Sort_50dp.png"
                                  alt="並び替えアイコン"
                                  width={30}
                                  height={30}
                                  draggable={false}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      }
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
