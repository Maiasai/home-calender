//献立作成モーダル（切り替え用）
'use client';

import { useState } from 'react';
import MealModal from './MealModal';
import MealRecipeSelect from './MealRecipeSelect';
import { MealModalStep } from '../_typs/MealModalStep';
import { useRecipes } from '@/app/_components/recipe/_hooks/useRecipes';
import { CategoryFilter } from '@/app/_components/recipe/_types/CategoryFilter';
import { SelectedRecipe } from '../_typs/SelectedRecipe';
import CustomizeView from './CustomizeView';
import PageHeader from '@/app/_components/recipe/components/PageHeader';
import { useForm } from 'react-hook-form';

type Props = {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
};

const titles = {
  select: '献立作成',
  recipeSelect: '献立作成',
  customize: '献立作成',
};

const MealModalBase = ({ open, onClose, selectedDate }: Props) => {
  const [step, setStep] = useState<MealModalStep>('select');
  const [category, setCategory] = useState<CategoryFilter>(''); // "" は「すべて」
  const [inputKeyword, setInputKeyword] = useState(''); //→ 入力中
  const [keyword, setKeyword] = useState(''); //→検索
  const [favoriteFilter, setFavoriteFilter] = useState(false); //お気に入りフィルター
  const [cookedFilter, setCookedFilter] = useState(false); //作ったことあるフィルター
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]); //選択されたレシピをここで管理（配列の中に、選択済みレシピのオブジェクトが入ってる）

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  //未カテゴリ
  const hasUnassingned = selectedRecipes.some(
    (r) => r.mealType === 'UNASSIGNED',
  );
  // 未カテゴリがある場合はボタンを無効化
  const isDisabled =
    isSubmitting || hasUnassingned || selectedRecipes.length === 0;
  const isEmpty = selectedRecipes.length === 0;

  //レシピ情報を取得
  const { recipes, isLoading, isError, mutate } = useRecipes({
    //レンダリング時に毎回実行されるもの（setStateされ再レンダリング後に実行）
    keyword,
    category, //選択中のカテゴリが入る
    favorite: favoriteFilter, //意味）APIパラメータ名 : UIのstate
    cooked: cookedFilter,
  });

  //閉じる機能
  const handleClose = () => {
    setStep('select');
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex  items-center justify-center">
        {/* モーダル内 */}
        <div className="bg-white p-6 rounded w-[500px] h-[500px] overflow-auto">
          <div>
            <PageHeader
              title={titles[step]}
              showBack={step !== 'select'}
              onBack={() => setStep('select')}
              onClose={handleClose}
            />

            <h2 className="flex justify-center">
              {selectedDate?.toLocaleDateString()} の献立
            </h2>
          </div>

          {step === 'select' && ( //ボタンが押されたらstep変更を依頼
            <MealModal
              selectedRecipes={selectedRecipes}
              setSelectedRecipes={setSelectedRecipes} // 同期用
              onSelect={setStep}
              onClose={onClose}
              selectedDate={selectedDate}
              isDisabled={isDisabled}
              hasUnassingned={hasUnassingned}
              isEmpty={isEmpty}
            />
          )}

          {step === 'recipeSelect' && ( //ボタンが押されたらstep変更を依頼
            <MealRecipeSelect
              recipes={recipes}
              isLoading={isLoading}
              isError={isError}
              inputKeyword={inputKeyword}
              setInputKeyword={setInputKeyword}
              setKeyword={setKeyword}
              favoriteFilter={favoriteFilter}
              setFavoriteFilter={setFavoriteFilter}
              cookedFilter={cookedFilter}
              setCookedFilter={setCookedFilter}
              category={category}
              setCategory={setCategory}
              selectedRecipes={selectedRecipes}
              setSelectedRecipes={setSelectedRecipes}
              onBack={() => setStep('select')}
            />
          )}

          {step === 'customize' && ( //ボタンが押されたらstep変更を依頼
            <CustomizeView
              selectedRecipes={selectedRecipes}
              setSelectedRecipes={setSelectedRecipes}
              isDisabled={isDisabled}
              hasUnassingned={hasUnassingned}
              onBack={() => setStep('select')}
              isEmpty={isEmpty}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MealModalBase;
