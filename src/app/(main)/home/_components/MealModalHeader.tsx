//献立作成モーダル（ヘッダー部分）

'use client';

import { MealModalStep } from '../_typs/MealModalStep';
import { SelectedRecipe } from '../_typs/SelectedRecipe';
import { KeyedMutator } from 'swr';
import { MonthData } from '../_typs/Menu';
import { Meal } from '../_typs/Meal';
import { MealRequestBody } from '../_typs/MealRequestBody';
import { useSupabaseSession } from '../_hooks/useSupabaseSession';
import PrimaryButton from '@/components/button/PrimaryButton';

type Props = {
  onSelect: (step: MealModalStep) => void;
  selectedRecipes: SelectedRecipe[];
  onClose: () => void;
  selectedDate: Date;
  isDisabled: boolean;
  hasUnselected: boolean;
  mutate: KeyedMutator<MonthData>;
  mode: 'create' | 'edit';
  targetMeal: Meal | null;
};

const MealModalHeader = ({
  onSelect,
  selectedRecipes,
  onClose,
  selectedDate,
  isDisabled,
  hasUnselected,
  mutate,
  mode,
  targetMeal,
}: Props) => {
  const { token } = useSupabaseSession();

  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate.getDate()).padStart(2, '0');
  const date = `${year}-${month}-${day}`;

  //作成と更新処理
  const onSubmit = async () => {
    try {
      //重複除去
      const uniqueRecipes = selectedRecipes.filter(
        //条件がtrueのものだけ残す
        //recipe→今見てる1件、index→今何番目か、self→元の配列全部
        (recipe, index, self) =>
          //findIndex(条件)→条件に最初に一致した番号を返す
          index === self.findIndex((r) => r.id === recipe.id),
      );

      const basePayload: MealRequestBody = {
        //API側でユーザーの特定をしているためuser.idはここでは不要
        date: date,
        recipes: uniqueRecipes.map((r, index) => {
          if (r.mealType === 'UNSELECTED') {
            //DB保存時、null想定なしのためフロントであらかじめ弾いておく
            throw new Error('mealType未選択');
          }

          return {
            //フロント側でmapすることで、API側でmap不要

            recipeId: r.id,
            mealType: r.mealType,
            position: index,
          };
        }),
      };

      const payload =
        mode === 'edit' ? { ...basePayload, id: targetMeal!.id } : basePayload;
      //「!」→targetMeal は null でも undefined でもないと自分が保証するという意味

      const res = await fetch('/api/meal-plan', {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();

        console.error('保存失敗:', res.status, errorData);
        throw new Error('保存失敗');
      }
      await mutate();
      alert('献立を更新しました');
      onClose(); //成功時
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col px-2">
        <div className="flex justify-end w-full mb-2">
          <PrimaryButton
            onClick={onSubmit}
            disabled={isDisabled}
            className="w-[80px] h-[30px]"
            variant="primary"
          >
            登録
          </PrimaryButton>
        </div>

        <div className="flex items-center gap-2 ml-auto mb-2">
          <PrimaryButton
            onClick={() => onSelect('customize')}
            className="flex items-center justify-center gap-1 w-[114px] h-[34px] "
            variant="secondary"
          >
            カスタマイズ
          </PrimaryButton>

          <PrimaryButton
            onClick={() => onSelect('recipeSelect')}
            className="w-[130px] h-[30px]"
            variant="primary"
          >
            ＋レシピから選択
          </PrimaryButton>
        </div>

        {hasUnselected && (
          <p className="text-red-500 text-xs mt-1">
            ※カテゴリが未選択のレシピがあります。
            カスタマイズから分類してください。
          </p>
        )}
      </div>
    </>
  );
};

export default MealModalHeader;
