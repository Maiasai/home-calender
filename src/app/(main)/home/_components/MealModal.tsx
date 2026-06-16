//献立作成モーダル（UI）　献立作成ボタン押下後に表示されるモーダル
//ここに作成と更新処理を記載

'use client';

import { SelectedRecipe } from '../_typs/SelectedRecipe';
import Image from 'next/image';
import { truncateRecipeTitle } from '@/utils/format';
import { UiMealType } from '../_typs/UiMealType';
import { getMealIcon } from '../_utils/getMealIcon';

type Props = {
  selectedRecipes: SelectedRecipe[];
  isEmpty: boolean;
};

const MealModal = ({ selectedRecipes, isEmpty }: Props) => {
  //カテゴリ分け　外枠
  const categories: UiMealType[] = [
    'BREAKFAST',
    'LUNCH',
    'DINNER',
    'UNSELECTED',
  ];

  return (
    <>
      {/* 献立がない場合の表示 */}
      {isEmpty && (
        <div className="flex items-center justify-center w-full mt-20 mb-28">
          <p>まだ献立がありません</p>
        </div>
      )}

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
            <div key={category} className="flex flex-col p-2">
              <div>
                {icon && ( //アイコンある時だけ表示
                  <Image
                    src={icon}
                    alt="カテゴリアイコン"
                    className="mb-2"
                    width={25}
                    height={25}
                  />
                )}

                {/* レシピ画像とタイトル */}

                {recipesInCategory?.map((r) => {
                  const imageSrc =
                    r.thumbnailUrl && r.thumbnailUrl.trim() !== ''
                      ? r.thumbnailUrl
                      : '/images/noImage.jpg';

                  return (
                    <div key={r.id} className="flex items-center gap-3 mb-4">
                      {/* 画像 */}
                      <div className="w-[130px] h-[80px] overflow-hidden relative shrink-0 rounded-lg">
                        <Image
                          src={imageSrc}
                          alt="画像"
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* タイトル*/}
                      <div>{truncateRecipeTitle(r.title)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MealModal;
