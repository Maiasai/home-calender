//献立作成モーダル（UI）　献立作成ボタン押下後に表示されるモーダル
//ここに作成と更新処理を記載

'use client';

import { Dispatch, SetStateAction } from 'react';
import { MealModalStep } from '../_typs/MealModalStep';
import { SelectedRecipe } from '../_typs/SelectedRecipe';
import Image from 'next/image';
import { KeyedMutator } from 'swr';
import { MonthData } from '../_typs/Menu';
import { Meal } from '../_typs/Meal';
import { MealRequestBody } from '../_typs/MealRequestBody';
import { truncateRecipeTitle } from '@/utils/format';
import { UiMealType } from '../_typs/UiMealType';

type Props = {
  onSelect: (step: MealModalStep) => void;
  selectedRecipes: SelectedRecipe[];
  setSelectedRecipes: Dispatch<SetStateAction<SelectedRecipe[]>>;
  onClose: () => void;
  selectedDate: Date;
  isDisabled: boolean;
  hasUnselected: boolean;
  isEmpty: boolean;
  mutate: KeyedMutator<MonthData>;
  mode: 'create' | 'edit';
  targetMeal: Meal | null;
};

const MealModal = ({
  onSelect,
  selectedRecipes,
  setSelectedRecipes,
  onClose,
  selectedDate,
  isDisabled,
  hasUnselected,
  isEmpty,
  mutate,
  mode,
  targetMeal,
}: Props) => {
  //カテゴリアイコン
  const getMealIcon = (type: UiMealType) => {
    switch (type) {
      case 'BREAKFAST':
        return '/images/morningIcon.png';
      case 'LUNCH':
        return '/images/daytimeIcon.png';
      case 'DINNER':
        return '/images/nightIcon.png';
      case 'UNSELECTED':
        return '/images/nullIcon.png';
      default:
        return null;
    }
  };

  //カテゴリ分け　外枠
  const categories: UiMealType[] = [
    'BREAKFAST',
    'LUNCH',
    'DINNER',
    'UNSELECTED',
  ];

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
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('保存失敗');
      }

      await mutate();
      onClose(); //成功時
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-end w-full mb-2">
          <button
            onClick={onSubmit}
            disabled={isDisabled}
            className={`transition
              ${isDisabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
          >
            <Image
              src="/images/create.png"
              alt="登録ボタン"
              width={70}
              height={70}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => onSelect('customize')}>
            <Image
              src="/images/customize.png"
              alt="カスタマイズ"
              width={100}
              height={70}
            />
          </button>

          <button onClick={() => onSelect('recipeSelect')}>
            <Image
              src="/images/selectfromrecipe.png"
              alt="レシピから選択"
              width={120}
              height={70}
            />
          </button>
        </div>
      </div>
      {hasUnselected && (
        <p className="text-red-500 text-xs mt-1">
          ※カテゴリが未選択のレシピがあります。
          カスタマイズから分類してください。
        </p>
      )}

      <div className="flex items-center justify-center w-full mt-10">
        {/* 献立がない場合の表示 */}
        {isEmpty && <p>まだ献立がありません</p>}
      </div>

      <div>
        {/* カテゴリごとにUIを作っている */}
        {categories.map((category) => {
          //selectedRecipesから1件ずつ取り出して一致するか見てる
          const recipesInCategory = selectedRecipes.filter(
            (r) => r.mealType === category,
          ); //この時点でカテゴリごとにレシピが分類される
          if (recipesInCategory.length === 0) return null; //そのカテゴリにレシピが1件もなかったら、カテゴリごと表示しない

          const icon = getMealIcon(category);

          return (
            <div key={category}>
              {icon && ( //アイコンある時だけ表示
                <Image
                  src={icon}
                  alt="カテゴリアイコン"
                  className="w-6 h-6 my-2"
                  width={20}
                  height={20}
                />
              )}

              {/* レシピ画像とタイトル */}
              <div className="flex flex-col gap-4">
                {recipesInCategory?.map((r) => (
                  <div key={r.id} className="flex items-center gap-6">
                    {/* 画像 */}
                    <div className="w-24 h-16 overflow-hidden relative">
                      <Image
                        src={r.thumbnailUrl ?? '/images/noImage.jpg'}
                        alt="画像"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    {/* タイトル*/}
                    <div>{truncateRecipeTitle(r.title)}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MealModal;
