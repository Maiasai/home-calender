//献立作成モーダルにてカスタマイズ押下後の画面
'use client';

import { Dispatch, SetStateAction } from 'react';
import { SelectedRecipe } from '../_typs/SelectedRecipe';
import Image from 'next/image';
import { truncateRecipeTitle } from '@/utils/format';
import { MealType } from '@/generated/prisma';

type Props = {
  selectedRecipes: SelectedRecipe[];
  setSelectedRecipes: Dispatch<SetStateAction<SelectedRecipe[]>>;
  onBack: () => void;
  isDisabled: boolean;
  hasUnselected: boolean;
  isEmpty: boolean;
};

const CustomizeView = ({
  selectedRecipes,
  setSelectedRecipes,
  onBack,
  isDisabled,
  hasUnselected,
  isEmpty,
}: Props) => {
  const mealTypes: MealType[] = ['BREAKFAST', 'LUNCH', 'DINNER'];

  //レシピ内のカテゴリを変更、２件以上同じカテゴリ登録できないロジック
  const changeMealType = (id: string, type: MealType | null) => {
    //type → 選択されたカテゴリ
    setSelectedRecipes((prev) => {
      // 未以外は2件制限
      if (type !== null) {
        //選択されたカテゴリが null でない場合
        const count = prev.filter((r) => r.mealType === type).length; //元々の配列にあるtypeと、入ってきたタイプが同じものがいくつか。
        if (count >= 2) return prev; //そのカテゴリにすでに割り当てられているレシピが 2 件以上なら 変更を無視して元の配列を返す
      }

      //対象のレシピだけmealTypeを変更し、新しい配列をmapで作る
      return prev.map(
        (
          r, //　r　→　元々の配列からレシピを取り出す
        ) =>
          r.id === id // r.id→元々のレシピid、id→変更したいレシピのID（クリックされたやつ）
            ? { ...r, mealType: type } // ←　一致するidがあったら　→「...r」で元のレシピをコピーして、mealType: type（クリックされたtype）で上書き
            : r,
      );
    });
  };

  const handleSave = () => {
    if (hasUnselected) {
      alert('未分類のレシピがあります');
      return;
    }
    try {
      onBack();
    } catch (e) {
      alert('保存に失敗しました');
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row w-full justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isDisabled}
            className={`transition
              ${isDisabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
          >
            <Image
              src="/images/save.png"
              alt="保存ボタン"
              width={70}
              height={50}
            />
          </button>
        </div>

        <div className="flex items-center justify-center w-full mt-10">
          {/* 献立がない場合の表示 */}
          {isEmpty && <p>まだ献立がありません</p>}
        </div>

        {selectedRecipes?.map((recipe) => (
          <div key={recipe.id} className="flex items-center gap-4">
            {/* 画像 */}
            <div className="w-[100px] h-[70px] relative overflow-hidden rounded-lg">
              <Image
                src={recipe.thumbnailUrl || '/images/noImage.jpg'}
                alt="レシピ画像"
                fill
                className="object-cover"
              />
            </div>

            {recipe.mealType === null && <div className="text-xs">未選択</div>}

            <div className="flex flex-col w-full">
              <div>{truncateRecipeTitle(recipe.title)}</div>

              {/* ラジオボタン */}
              <div className="flex gap-4">
                {mealTypes.map((type) => (
                  <label key={type} className="flex gap-1">
                    <input
                      type="radio"
                      name={`meal-${recipe.id}`} //レシピごとに独立したラジオボタンにしている
                      checked={recipe.mealType === type} //今何が選ばれているか（recipe.mealTypeは親の selectedRecipes 配列から受け取っている）
                      onChange={() => changeMealType(recipe.id, type)} //クリックされたレシピidと選択肢をchangeMealType に渡す
                    />
                    {type === 'BREAKFAST' && '朝'}
                    {type === 'LUNCH' && '昼'}
                    {type === 'DINNER' && '晩'}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CustomizeView;
