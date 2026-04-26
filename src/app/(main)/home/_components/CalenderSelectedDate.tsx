//カレンダーで選択した日付の詳細

'use client';

import Image from 'next/image';
import { MonthData } from '../_typs/Menu';
import MenuButton from './MenuButton';
import { Meal } from '../_typs/Meal';
import Link from 'next/link';

type Props = {
  data: MonthData;
  selectedDate: Date;
  setModalOpen: (v: boolean) => void;
  onEdit: (meal: Meal) => void;
  onList: (meal: Meal) => void;
};

const CalenderSelectedDate = ({
  data,
  selectedDate,
  setModalOpen,
  onEdit,
  onList,
}: Props) => {
  //詳細表示用
  const selectedKey = selectedDate.toLocaleDateString('sv-SE'); //選択している日付
  const selectedDayData = data?.[selectedKey]; //右記のような形→{breakfast: Recipe[] lunch: Recipe[] dinner: Recipe[]}

  //その日の献立が空の場合
  const isEmpty =
    !selectedDayData?.breakfast?.length &&
    !selectedDayData?.lunch?.length &&
    !selectedDayData?.dinner?.length;

  //その日の献立取得用（編集用データ）*朝昼晩を１つの配列にまとめてMeal型に変換
  const meal: Meal | null = selectedDayData
    ? {
        id: selectedDayData.id,
        date: selectedKey,
        recipes: [
          //配列の中に配列で展開されてしまうため、スプレッド構文を使用。[{...},{...},{...}]
          ...selectedDayData.breakfast.map((r) => ({
            recipe: {
              id: r.id,
              title: r.title,
              thumbnailUrl: r.thumbnailUrl ?? '/images/noImage.jpg',
            },
            mealType: 'BREAKFAST' as const,
          })),
          ...selectedDayData.lunch.map((r) => ({
            recipe: {
              id: r.id,
              title: r.title,
              thumbnailUrl: r.thumbnailUrl ?? '/images/noImage.jpg',
            },
            mealType: 'LUNCH' as const,
          })),
          ...selectedDayData.dinner.map((r) => ({
            recipe: {
              id: r.id,
              title: r.title,
              thumbnailUrl: r.thumbnailUrl ?? '/images/noImage.jpg',
            },
            mealType: 'DINNER' as const,
          })),
        ],
      }
    : null;

  //献立削除処理
  const deleteMeal = async (mealId: string) => {
    const ok = window.confirm('この献立を削除しますか？');

    if (!ok) return;

    try {
      await fetch('/api/meal-plan', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: mealId,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col">
      <div className='mt-4 p-3 border rounded"'>
        <div className="flex justify-between items-center mb-4 ">
          {selectedDate.toLocaleDateString()} の献立
          {isEmpty && (
            <button onClick={() => setModalOpen(true)}>
              <img
                src="/images/menucreatebutton.png"
                alt="献立作成ボタン"
                width={80}
              />
            </button>
          )}
          {!isEmpty && meal && (
            <MenuButton
              onEdit={() => {
                onEdit(meal); //MenuButtonから来たイベントに「この日の献立」をくっつけて親に渡す
              }}
              onList={() => {
                onList(meal);
              }}
              onDelete={() => deleteMeal(meal.id)}
            />
          )}
        </div>
        <div>
          {isEmpty && <div>献立が未登録です</div>}

          {/* 朝 */}
          {selectedDayData?.breakfast.map((item) => (
            <Link href={`/recipes/${item.id}`}>
              <div
                key={item.id}
                className="flex items-center text-sm gap-x-2 mb-4"
              >
                <div>
                  <Image
                    src="/images/morningIcon.png"
                    alt="朝アイコン"
                    width={20}
                    height={20}
                    className="mr-1"
                  />{' '}
                </div>
                <div>
                  <Image
                    src={item.thumbnailUrl ?? '/images/noImage.jpg'}
                    alt={item.title}
                    width={100}
                    height={100}
                  />
                </div>
                {item.title}
              </div>
            </Link>
          ))}

          {/* 昼 */}
          {selectedDayData?.lunch.map((item) => (
            <Link href={`/recipes/${item.id}`}>
              <div
                key={item.id}
                className="flex items-center text-sm gap-x-2 mb-4"
              >
                <Image
                  src="/images/daytimeIcon.png"
                  alt="昼アイコン"
                  width={20}
                  height={20}
                  className="mr-1"
                />{' '}
                <Image
                  src={item.thumbnailUrl ?? '/images/noImage.jpg'}
                  alt={item.title}
                  width={100}
                  height={100}
                />
                {item.title}
              </div>
            </Link>
          ))}
          {/* 夜 */}
          {selectedDayData?.dinner.map((item) => (
            <Link href={`/recipes/${item.id}`}>
              <div
                key={item.id}
                className="flex items-center text-sm gap-x-2 mb-4"
              >
                <Image
                  src="/images/nightIcon.png"
                  alt="夜アイコン"
                  width={20}
                  height={20}
                  className="mr-1"
                />{' '}
                <Image
                  src={item.thumbnailUrl ?? '/images/noImage.jpg'}
                  alt={item.title}
                  width={100}
                  height={100}
                />
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalenderSelectedDate;
