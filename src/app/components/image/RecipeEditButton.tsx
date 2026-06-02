//レシピ編集ボタン

'use client';

import PrimaryButton from '@/components/button/PrimaryButton';

const RecipeEditButton = () => {
  return (
    <PrimaryButton className="w-[100px] h-[30px] text-sm font-semibold active:scale-95 active:shadow-sm">
      編集
    </PrimaryButton>
  );
};

export default RecipeEditButton;
