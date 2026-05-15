//カレンダーで選択した日付の詳細

'use client';

import Image from 'next/image';
import { MonthData } from '../_typs/Menu';
import MenuButton from './MenuButton';
import { Meal } from '../_typs/Meal';
import Link from 'next/link';
import { useState } from 'react';
import ConfirmDialog from '../../recipes/_components/ConfirmDialog';
import { MealId } from '../_typs/MealId';
import { NutritionResult } from '@/lib/nutrition/typs';
import calculateNutrition from '@/lib/nutrition/calculateNutrition';
import NutritionResultView from './NutritionResultView';

type Props = {
  data: MonthData;
  selectedDate: Date;
  setModalOpen: (v: boolean) => void;
  onEdit: (meal: Meal) => void;
  onList: (meal: Meal) => void;
  displayDate: string;
};

const CalenderSelectedDate = ({
  data,
  selectedDate,
  setModalOpen,
  onEdit,
  onList,
  displayDate,
}: Props) => {
  //詳細表示用
  const selectedKey = selectedDate.toLocaleDateString('sv-SE'); //選択している日付
  const selectedDayData = data?.[selectedKey]; //右記のような形→{breakfast: Recipe[] lunch: Recipe[] dinner: Recipe[]}
  const [open, setOpen] = useState(false);
  const [targetMealId, setTargetMealId] = useState<MealId | null>(null);
  const [nutritionResult, setNutritionResult] =
    useState<NutritionResult | null>(null); //栄養チェック結果管理用
  const [nutritionOpen, setNutritionOpen] = useState(false); //栄養チェックモーダル管理用

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
              ingredients: r.ingredients ?? [],
            },
            mealType: 'BREAKFAST' as const,
          })),
          ...selectedDayData.lunch.map((r) => ({
            recipe: {
              id: r.id,
              title: r.title,
              thumbnailUrl: r.thumbnailUrl ?? '/images/noImage.jpg',
              ingredients: r.ingredients ?? [],
            },
            mealType: 'LUNCH' as const,
          })),
          ...selectedDayData.dinner.map((r) => ({
            recipe: {
              id: r.id,
              title: r.title,
              thumbnailUrl: r.thumbnailUrl ?? '/images/noImage.jpg',
              ingredients: r.ingredients ?? [],
            },
            mealType: 'DINNER' as const,
          })),
        ],
      }
    : null;

  //献立削除処理
  const deleteMeal = async (mealId: MealId) => {
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
          {displayDate} の献立
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
              onDelete={() => {
                setTargetMealId(meal.id);
                setOpen(true);
              }}
              onNutrition={() => {
                setNutritionResult(calculateNutrition(meal));
                setNutritionOpen(true);
              }}
            />
          )}
        </div>
        <div>
          {isEmpty && <div>献立が未登録です</div>}

          {/* 朝 */}
          {selectedDayData?.breakfast.map((item) => (
            <Link key={item.id} href={`/recipes/${item.id}`}>
              <div className="flex items-center text-sm gap-x-2 mb-4">
                <div>
                  <Image
                    src="/images/morningIcon.png"
                    alt="朝アイコン"
                    width={20}
                    height={20}
                    className="mr-1"
                  />{' '}
                </div>
                <div className="relative w-full max-w-[180px] aspect-[4/3] overflow-hidden rounded">
                  <Image
                    src={item.thumbnailUrl ?? '/images/noImage.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {item.title}
              </div>
            </Link>
          ))}

          {/* 昼 */}
          {selectedDayData?.lunch.map((item) => (
            <Link key={item.id} href={`/recipes/${item.id}`}>
              <div className="flex items-center text-sm gap-x-2 mb-4">
                <Image
                  src="/images/daytimeIcon.png"
                  alt="昼アイコン"
                  width={20}
                  height={20}
                  className="mr-1"
                />{' '}
                <div className="relative w-full max-w-[180px] aspect-[4/3] overflow-hidden rounded">
                  <Image
                    src={item.thumbnailUrl ?? '/images/noImage.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {item.title}
              </div>
            </Link>
          ))}
          {/* 夜 */}
          {selectedDayData?.dinner.map((item) => (
            <Link key={item.id} href={`/recipes/${item.id}`}>
              <div className="flex items-center text-sm gap-x-2 mb-4">
                <Image
                  src="/images/nightIcon.png"
                  alt="夜アイコン"
                  width={20}
                  height={20}
                  className="mr-1"
                />{' '}
                <div className="relative w-full max-w-[180px] aspect-[4/3] overflow-hidden rounded">
                  <Image
                    src={item.thumbnailUrl ?? '/images/noImage.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={open}
        title="確認"
        message="この献立を削除しますか？"
        onCancel={() => setOpen(false)}
        onConfirm={async () => {
          if (!targetMealId) return;

          await deleteMeal(targetMealId);
          setOpen(false);
        }}
      />

      {nutritionOpen && nutritionResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 rounded-sm">
          <NutritionResultView
            result={nutritionResult}
            onClose={() => setNutritionOpen(false)}
            displayDate={displayDate}
          />
        </div>
      )}
    </div>
  );
};

export default CalenderSelectedDate;
