//検索絞り込み項目（献立作成モーダル)
'use client';

import PrimaryButton from '@/components/button/PrimaryButton';

type Props = {
  inputKeyword: string;
  setInputKeyword: (v: string) => void;
  setKeyword: (v: string) => void;
};

const SearchBarSimple = ({
  inputKeyword,
  setInputKeyword,
  setKeyword,
}: Props) => {
  return (
    <div className="flex justify-center mb-4 gap-2">
      <input
        value={inputKeyword}
        onChange={(e) => setInputKeyword(e.currentTarget.value)}
        onKeyDown={(e) => {
          //エンターでも検索実行可能
          if (e.key === 'Enter') {
            setKeyword(inputKeyword);
          }
        }}
        className="pl-5 w-[259px] h-[37px] border border-gray-300 rounded-lg"
        placeholder="レシピ名、食材から探す"
      />

      <PrimaryButton
        className="flex items-center justify-center gap-1 w-[114px] h-[34px]"
        onClick={() => setKeyword(inputKeyword)}
        variant="secondary"
      >
        検索
      </PrimaryButton>
    </div>
  );
};

export default SearchBarSimple;
