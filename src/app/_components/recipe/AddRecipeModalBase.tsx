//レシピ登録モーダル（画面切り替え管理）
'use client';

import { useState } from 'react';
import AddRecipeSelect from './AddRecipeSelect';
import AddRecipeUrlModal from './AddRecipeUrlModal';
import AddRecipeTextModal from './AddRecipeTextModal';
import AddRecipeManualModal from './AddRecipeManualModal';
import { RecipeModalStep } from '@/app/_components/recipe/_types/RecipeModalStep';
import PageHeader from './components/PageHeader';

type Props = {
  open: boolean;
  onClose: () => void;
};

const titles = {
  select: 'レシピ登録',
  URL: 'URLから追加する',
  TEXT: 'テキストからレシピを登録する',
  MANUAL: 'オリジナルでレシピ登録する',
};

const AddRecipeModalBase = ({ open, onClose }: Props) => {
  const [step, setStep] = useState<RecipeModalStep>('select');
  //→ここでstep管理。header管理、モーダル切り替えをする
  //モーダル内の画面遷移はモーダルの責務になるのでここにstepのstateは書く

  const handleClose = () => {
    setStep('select'); //stepを初期化
    onClose(); //親から渡された onClose() を実行→親の setRecipeModalOpen(false) が実行されモーダル閉じる
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 min-h-[200px] min-w-[200px] rounded-lg">
        {/* ヘッダーを props で制御 */}
        <PageHeader
          title={titles[step]} //（例）step="URL"　→ url入ってきたらtitlesのurlテキストがヘッダーに設定
          showBack={step !== 'select'} //select画面だけ戻るボタン無し
          onBack={() => setStep('select')} //戻る押すとselect画面に戻る
          showClose
          onClose={handleClose} //×ボタン押されるとPageHeaderのonClickが発火→handleClose
        />

        {step === 'select' && ( //ボタンが押されたらstep変更を依頼
          <AddRecipeSelect onSelect={setStep} /> //モーダルにsetStep という関数をonSelectという名前で渡してる
        )}

        {step === 'URL' && (
          <AddRecipeUrlModal onBack={() => setStep('select')} />
        )}

        {step === 'TEXT' && (
          <AddRecipeTextModal onBack={() => setStep('select')} />
        )}

        {step === 'MANUAL' && <AddRecipeManualModal onClose={onClose} />}
      </div>
    </div>
  );
};

export default AddRecipeModalBase;
