//献立作成モーダル（切り替え用）
'use client';

import { useEffect, useState } from 'react';
import MealModal from './MealModal';
import MealRecipeSelect from './MealRecipeSelect';
import { MealModalStep } from '../_typs/MealModalStep';
import { SelectedRecipe } from '../_typs/SelectedRecipe';
import CustomizeView from './CustomizeView';
import { useForm } from 'react-hook-form';
import { useRecipes } from '../../recipes/_hooks/useRecipes';
import PageHeader from '../../recipes/_components/PageHeader';
import { CategoryFilter } from '../../recipes/_types/category/CategoryFilter';
import { MonthData } from '../_typs/Menu';
import { KeyedMutator } from 'swr';
import { Meal } from '../_typs/Meal';

type Props = {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  mutate: KeyedMutator<MonthData>;

  mode: 'create' | 'edit';
  initialRecipes?: SelectedRecipe[];
  targetMeal: Meal | null;
};

const MealModalBase = ({
  open,
  onClose,
  selectedDate,
  mutate,
  mode,
  initialRecipes,
  targetMeal,
}: Props) => {
  const [step, setStep] = useState<MealModalStep>('select');
  const [category, setCategory] = useState<CategoryFilter>(''); // "" は「すべて」
  const [inputKeyword, setInputKeyword] = useState(''); //→ 入力中
  const [keyword, setKeyword] = useState(''); //→検索
  const [favoriteFilter, setFavoriteFilter] = useState(false); //お気に入りフィルター
  const [cookedFilter, setCookedFilter] = useState(false); //作ったことあるフィルター
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]); //ユーザーが今操作してる状態→選択されたレシピをここで管理（配列の中に、選択済みレシピのオブジェクトが入ってる）

  const {
    formState: { isSubmitting },
  } = useForm();

  //未カテゴリ
  const hasUnselected = selectedRecipes.some(
    (r) => r.mealType === 'UNSELECTED',
  );
  // 未カテゴリがある場合はボタンを無効化
  const isDisabled =
    isSubmitting || hasUnselected || selectedRecipes.length === 0;
  const isEmpty = selectedRecipes.length === 0;

  //レシピ情報を取得
  const { recipes, isLoading, isError } = useRecipes({
    //レンダリング時に毎回実行されるもの（setStateされ再レンダリング後に実行）
    keyword,
    category, //選択中のカテゴリが入る
    favorite: favoriteFilter, //意味）APIパラメータ名 : UIのstate
    cooked: cookedFilter,
  });

  //編集画面の場合（最初からデータありの状態にする）
  //Reactは「コンポーネントを再利用」してしまうため、手動でリセットする必要がある
  useEffect(() => {
    if (mode === 'edit' && initialRecipes) {
      setSelectedRecipes(initialRecipes); //元データをコピーして作業用データを作ってる
    }
    if (mode === 'create') {
      //新規作成なら空からスタート
      setSelectedRecipes([]);
    }
  }, [mode, initialRecipes]); // mode または initialRecipes が変わったときにこのuseEffect発火

  //タイトル処理
  const baseTitle = mode === 'edit' ? '献立編集' : '献立作成';

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
              title={baseTitle}
              showBack={step !== 'select'}
              onBack={() => setStep('select')}
              onClose={handleClose}
              showClose
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
              hasUnselected={hasUnselected}
              isEmpty={isEmpty}
              mutate={mutate}
              mode={mode}
              targetMeal={targetMeal}
            />
          )}

          {step === 'recipeSelect' && ( //ボタンが押されたらstep変更を依頼
            <MealRecipeSelect
              recipes={recipes}
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
              hasUnselected={hasUnselected}
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
