//カテゴリアイコン（選択ロジック）（登録・編集用）
'use client';

import CategoryBadge from '@/app/components/image/CategoryBadge';
import { RecipeCategory } from '@/generated/prisma';

type CategoryForm = '' | RecipeCategory;

type Props = {
  category: CategoryForm;
  setCategory: (cat: CategoryForm) => void;
};

const CategorySelector = ({ category, setCategory }: Props) => {
  //カテゴリ切り替え
  //もし今選択されているカテゴリと同じなら→ null（解除）
  //違うなら→新しいカテゴリをセット
  const toggle = (cat: RecipeCategory) => {
    //引数に""はこない（Prismaの型をつかう）
    setCategory(category === cat ? '' : cat);
  };

  return (
    <div>
      <label>カテゴリを選択</label>

      <div className="flex gap-2">
        <CategoryBadge
          category="MAIN" //カテゴリの種類
          active={category === 'MAIN'} //選択状態
          onClick={() => toggle('MAIN')} //押した時の処理
          clickable
        />

        <CategoryBadge
          category="SIDE"
          active={category === 'SIDE'}
          onClick={() => toggle('SIDE')}
          clickable
        />
      </div>
    </div>
  );
};

export default CategorySelector;
