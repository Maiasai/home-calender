//レシピ一覧からレシピ追加＞開くモーダル

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RecipeModalStep } from '../_types/RecipeModalStep';
import AddRecipeModalBase from './AddRecipeModalBase';
import { KeyedMutator } from 'swr';
import { RecipeData } from '../_types/RecipeTypes';

type Props = {
  onSelect: (step: RecipeModalStep) => void;
  mutate: KeyedMutator<RecipeData[]>;
};

const AddRecipeSelect = ({ onSelect, mutate }: Props) => {
  const [RecipeModalOpen, setRecipeModalOpen] = useState(false);

  return (
    <div className="bg-gray-100 w-[600px] max-h-[60vh] overflow-y-auto">
      <div className="flex flex-col gap-3 m-3">
        <AddRecipeModalBase
          open={RecipeModalOpen} // モーダル表示/非表示の state
          onClose={() => setRecipeModalOpen(false)} // 閉じるボタン押したときに state を false にする
          mutate={mutate}
        />

        {/* URLから追加する */}
        <div className="flex flex-col bg-white  mx-4 mt-4 mb-2 p-4 rounded-lg">
          <button
            type="button"
            onClick={() => onSelect('URL')} //baseコンポーネントに次はURL画面にしてと依頼
            className="flex items-center gap-4 text-left"
          >
            {/* 左アイコン */}
            <div>
              <Image
                src="/images/link.png"
                alt="URLから追加するアイコン"
                width={40}
                height={40}
              />
            </div>

            {/* 右テキスト */}
            <div className="flex flex-col">
              <div>レシピURLを登録</div>
              <div className="text-sm">
                レシピ名とURLを入力して保存できます。
              </div>
            </div>
          </button>
        </div>

        {/* オリジナルレシピを登録する */}
        <div className="flex flex-col gap-6 bg-white mx-4 mb-4 p-4 rounded-lg">
          <button
            type="button"
            onClick={() => onSelect('MANUAL')}
            className="flex items-center gap-4 text-left"
          >
            {/* 左アイコン */}
            <div>
              <Image
                src="/images/pen.png"
                alt="オリジナルレシピを登録するアイコン"
                width={40}
                height={40}
              />
            </div>

            {/* 右テキスト */}
            <div className="flex flex-col">
              <div>オリジナルレシピを登録する</div>
              <div className="text-sm">
                自分で作ったレシピを、材料・手順を入力して自由に登録できます。
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipeSelect;
