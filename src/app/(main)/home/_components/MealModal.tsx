//献立作成モーダル（UI）　献立作成ボタン押下後に表示されるモーダル
'use client';

import { Dispatch, SetStateAction } from 'react';
import { MealModalStep } from '../_typs/MealModalStep';
import { SelectedRecipe } from '../_typs/SelectedRecipe';
import { MealType } from '../_typs/MealType';
import Image from 'next/image';

type MealRequestBody = {
  date: Date;
  recipes: {
    recipeId: string;
    mealType: MealType;
    position: number;
  }[];
};

type Props = {
  onSelect: (step: MealModalStep) => void;
  selectedRecipes: SelectedRecipe[];
  setSelectedRecipes: Dispatch<SetStateAction<SelectedRecipe[]>>;
  onClose: () => void;
  selectedDate: Date;
  isDisabled: boolean;
  hasUnassingned: boolean;
  isEmpty: boolean;
};

const MealModal = ({
  onSelect,
  selectedRecipes,
  setSelectedRecipes,
  onClose,
  selectedDate,
  isDisabled,
  hasUnassingned,
  isEmpty,
}: Props) => {
  //カテゴリアイコン
  const getMealIcon = (type: MealType) => {
    switch (type) {
      case 'BREAKFAST':
        return '/images/morningIcon.png';
      case 'LUNCH':
        return '/images/daytimeIcon.png';
      case 'DINNER':
        return '/images/nightIcon.png';
      case 'UNASSIGNED':
        return '/images/nullIcon.png';
      default:
        return null;
    }
  };

  //カテゴリ分け　外枠
  const categories: MealType[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'UNASSIGNED'];

  const onSubmit = async () => {
    try {
      const payload: MealRequestBody = {
        //API側でユーザーの特定をしているためuser.idはここでは不要
        date: selectedDate,
        recipes: selectedRecipes.map((r, index) => ({
          //フロント側でmapすることで、API側でmap不要
          recipeId: r.id,
          mealType: r.mealType,
          position: index,
        })),
      };

      const res = await fetch('/api/meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('保存失敗');
      }

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
      {hasUnassingned && (
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
                    <div className="w-24 aspect-[4/3] overflow-hidden">
                      <Image
                        src={r.thumbnailUrl}
                        alt="画像"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* タイトル*/}
                    <div>{r.title}</div>
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
