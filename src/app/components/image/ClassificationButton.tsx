//すべて、主菜、副菜、未分類　ボタン（レシピ一覧）
'use client';

import PrimaryButton from '@/components/button/PrimaryButton';
import React from 'react';

interface ClassificationButtonProps {
  children: string;
  isActive?: boolean; // 選択中なら見た目を変える
  onClick: () => void; // クリック時に親に通知
}

const ClassificationButton: React.FC<ClassificationButtonProps> = ({
  children,
  isActive = false, //選択中のボタンだけ色を変えられる
  onClick,
}) => {
  return (
    <PrimaryButton
      type="button"
      onClick={onClick} //onClick で親にカテゴリ変更を通知
      className="w-[74px] h-[34px]"
      variant={isActive ? 'primary' : 'secondary'}
    >
      {children}
    </PrimaryButton>
  );
};

export default ClassificationButton;
