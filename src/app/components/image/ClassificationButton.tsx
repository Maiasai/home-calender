//すべて、主菜、副菜、未分類　ボタン（レシピ一覧）
'use client';

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
    <button
      type="button"
      onClick={onClick} //onClick で親にカテゴリ変更を通知
      className={`w-[74px] h-[34px] rounded-lg  ${
        isActive
          ? ' bg-orange-500 text-white text-sm font-semibold shadow-md transition-all duration-150 hover:bg-orange-600 active:scale-95 active:shadow-sm'
          : ' border border-orange-200 bg-orange-100 text-orange-500 text-sm font-medium shadow-sm transition-all duration-150 hover:bg-orange-200 active:scale-95'
      }`}
    >
      {children}
    </button>
  );
};

export default ClassificationButton;
