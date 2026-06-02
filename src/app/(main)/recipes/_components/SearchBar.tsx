//検索絞り込み項目(レシピ一覧)
'use client';

import PrimaryButton from '@/components/button/PrimaryButton';
import Image from 'next/image';

type Props = {
  inputKeyword: string;
  setInputKeyword: (v: string) => void;
  setKeyword: (v: string) => void;
  setRecipeModalOpen: (v: boolean) => void;
  setIsBulkMode: (v: boolean) => void;
  isBulkMode: boolean;
};

const SearchBar = ({
  inputKeyword,
  setInputKeyword,
  setKeyword,
  setRecipeModalOpen,
  setIsBulkMode,
  isBulkMode,
}: Props) => {
  return (
    <div className="flex flex-col md:flex-row justify-center mb-4 gap-2">
      <div className="flex justify-center">
        <div className="relative">
          <input
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.currentTarget.value)}
            onKeyDown={(e) => {
              //エンターでも検索実行可能
              if (e.key === 'Enter') {
                setKeyword(inputKeyword);
              }
            }}
            className="w-[259px] h-[34px] pl-8 border bg-gray-100 border-gray-300 rounded-lg"
            placeholder="料理名、食材でさがす"
          />
          <Image
            src="/images/searchIcon.png"
            alt="検索アイコン"
            className="absolute left-3 top-1/2 -translate-y-1/2 block"
            width={15}
            height={15}
          />
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <PrimaryButton
          className="flex items-center justify-center gap-1 w-[114px] h-[34px]"
          onClick={() => setKeyword(inputKeyword)}
          variant="secondary"
        >
          検索
        </PrimaryButton>

        <PrimaryButton
          className="w-[114px] h-[34px]"
          variant="primary"
          onClick={() => setRecipeModalOpen(true)}
        >
          レシピ追加
        </PrimaryButton>

        <PrimaryButton
          className="w-[149px] h-[34px]"
          variant="primary"
          onClick={() => setIsBulkMode(!isBulkMode)}
        >
          一括操作モード
        </PrimaryButton>
      </div>
    </div>
  );
};

export default SearchBar;
