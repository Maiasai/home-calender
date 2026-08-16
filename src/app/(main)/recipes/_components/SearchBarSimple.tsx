//検索絞り込み項目（献立作成モーダル)
'use client';

import PrimaryButton from '@/components/button/PrimaryButton';
import { inputClass } from '@/components/input/inputStyles';
import Image from 'next/image';

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
    <div className="flex justify-center mb-4 gap-2 px-6 relative ">
      <input
        value={inputKeyword}
        onChange={(e) => setInputKeyword(e.currentTarget.value)}
        onKeyDown={(e) => {
          //エンターでも検索実行可能
          if (e.key === 'Enter') {
            setKeyword(inputKeyword);
          }
        }}
        className={`w-[259px] h-[34px] pl-8 ${inputClass}`}
        placeholder="料理名、食材でさがす"
      />
      <Image
        src="/images/search_24.png"
        alt="検索アイコン"
        className="absolute left-8 top-1/2 -translate-y-1/2 block"
        width={20}
        height={20}
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
