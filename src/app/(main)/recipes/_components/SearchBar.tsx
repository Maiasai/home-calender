//検索絞り込み項目(レシピ一覧)
'use client';

import PrimaryButton from '@/components/button/PrimaryButton';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import FilterPanel from './FilterPanel';
import CategoryFilterButtons from './CategoryFilterButtons';
import { CategoryFilter } from '../_types/category/CategoryFilter';

type Props = {
  inputKeyword: string;
  setInputKeyword: (v: string) => void;
  setKeyword: (v: string) => void;
  setRecipeModalOpen: (v: boolean) => void;
  setIsBulkMode: (v: boolean) => void;
  isBulkMode: boolean;
  favoriteFilter: boolean;
  cookedFilter: boolean;
  category: CategoryFilter;
  setCategory: (v: CategoryFilter) => void;
  setFavoriteFilter: (v: boolean) => void;
  setCookedFilter: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
};

const SearchBar = ({
  inputKeyword,
  setInputKeyword,
  setKeyword,
  setRecipeModalOpen,
  setIsBulkMode,
  isBulkMode,
  favoriteFilter,
  cookedFilter,
  category,
  setCategory,
  setFavoriteFilter,
  setCookedFilter,
  menuOpen,
  setMenuOpen,
}: Props) => {
  return (
    <div className="flex flex-col justify-center">
      <div className="md:flex justify-center gap-2 mb-2">
        <div className="relative flex mb-1">
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
            src="/images/search_24.png"
            alt="検索アイコン"
            className="absolute left-2 top-1/2 -translate-y-1/2 block"
            width={20}
            height={20}
          />
          <PrimaryButton
            className="flex items-center justify-center gap-1 w-[84px] h-[34px] ml-2"
            onClick={() => setKeyword(inputKeyword)}
            variant="secondary"
          >
            検索
          </PrimaryButton>
        </div>

        <div className="flex justify-center gap-2">
          <PrimaryButton
            className="w-[100px] h-[34px]"
            variant="primary"
            onClick={() => setRecipeModalOpen(true)}
          >
            レシピ追加
          </PrimaryButton>

          <PrimaryButton
            className="w-[120px] h-[34px]"
            variant="primary"
            onClick={() => setIsBulkMode(!isBulkMode)}
          >
            一括操作モード
          </PrimaryButton>

          <button
            type="button"
            className="flex justify-center items-center ml-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="mx-1 text-xs">絞り込み</span>
            <Image
              src={
                menuOpen
                  ? '/images/menubutton02.png'
                  : '/images/menubutton01.png'
              }
              alt="絞り込みボタン"
              height={20}
              width={20}
            />
          </button>
        </div>
      </div>

      {/* 開閉される部分 */}

      <div>
        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              {/* お気に入りと作ったことある絞り込み */}
              <FilterPanel
                favoriteFilter={favoriteFilter}
                setFavoriteFilter={setFavoriteFilter}
                cookedFilter={cookedFilter}
                setCookedFilter={setCookedFilter}
              />

              {/* カテゴリ絞り込み※クリック時にセット */}
              <CategoryFilterButtons
                category={category}
                setCategory={setCategory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchBar;
