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
import { MealSection } from './MealSection';
import { buildMead } from '../_utils/buildMeal';

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
  const meal = buildMead({ selectedDayData, selectedKey });

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
        <div className="max-h-80 overflow-y-auto">
          {isEmpty && <div>献立が未登録です</div>}

          {/* 朝 */}
          <MealSection
            items={selectedDayData?.breakfast || []}
            iconSrc="/images/morningIcon.png"
            iconAlt="朝アイコン"
          />

          {/* 昼 */}
          <MealSection
            items={selectedDayData?.lunch || []}
            iconSrc="/images/daytimeIcon.png"
            iconAlt="昼アイコン"
          />

          {/* 夜 */}
          <MealSection
            items={selectedDayData?.dinner || []}
            iconSrc="/images/nightIcon.png"
            iconAlt="夜アイコン"
          />
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
