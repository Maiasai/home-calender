//カテゴリアイコン（共通UI）
'use client';

import type { RecipeCategory } from '@/generated/prisma'; //Prismaschemaから型だけとってきてる

type Props = {
  category: RecipeCategory | null;
  active?: boolean;
  onClick?: () => void;
  clickable?: boolean;
};

const CategoryBadge = ({
  category,
  active = true,
  onClick,
  clickable,
}: Props) => {
  //activeは選択されているかどうか

  const base = `py-1 px-2 rounded-lg border
    ${clickable ? 'cursor-pointer' : 'cursor-default'}`;

  //選択されたカテゴリによって表示を分岐
  if (category === 'MAIN') {
    return (
      <button
        type="button" //これをつけることで送信されてしまうのを伏せぐ
        onClick={clickable ? onClick : undefined}
        className={`${base} ${
          active
            ? 'border-[#f56666] bg-[#f56666] text-white'
            : 'border-[#f56666] text-[#f56666]'
        }`}
      >
        主菜
      </button>
    );
  }

  if (category === 'SIDE') {
    return (
      <button
        type="button"
        onClick={clickable ? onClick : undefined}
        className={`${base} ${
          active
            ? 'border-[#7bbc7c] bg-[#7bbc7c] text-white'
            : 'border-[#7bbc7c] text-[#7bbc7c]'
        }`}
      >
        副菜
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={clickable ? onClick : undefined}
      className={`${base} ${
        active
          ? 'border-gray-400 bg-gray-400 text-white'
          : 'border-gray-400 text-gray-400'
      }`}
    >
      未分類
    </button>
  );
};

export default CategoryBadge;
