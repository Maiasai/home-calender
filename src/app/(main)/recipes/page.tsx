//レシピ一覧ページ
//命名メモ　DB（hasCooked),API内部,(isCooked),URLパラメータ(cooked),UIstate(cookedFilter)
//DBとAPI内部(isFavorite),URLパラメータ(favorite),UIstate(favoriteFilter)

'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import { CategoryFilter } from './_types/category/CategoryFilter';
import { useRecipes } from './_hooks/useRecipes';
import AddRecipeModalBase from './_components/AddRecipeModalBase';
import SearchBar from './_components/SearchBar';
import FilterPanel from './_components/FilterPanel';
import CategoryFilterButtons from './_components/CategoryFilterButtons';
import RecipeCard from './_components/RecipeCard';
import ConfirmDialog from './_components/ConfirmDialog';
import { useBodyScrollLock } from '@/components/_hooks/useBodyScrollLock';
import { useSupabaseSession } from '../home/_hooks/useSupabaseSession';
import { Loading } from '@/components/Loading';
import { Empty } from '@/components/Empty';
import ErrorMessage from './_components/ErrorMessage';

const RecipesPage = () => {
  const { token } = useSupabaseSession();

  const [RecipeModalOpen, setRecipeModalOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [inputKeyword, setInputKeyword] = useState(''); //検索欄に入力中の文字
  const [keyword, setKeyword] = useState(''); // 検索実行用キーワード。ここに入った値がuseRecipesに渡る
  const [category, setCategory] = useState<CategoryFilter>(''); // "" は「すべて」
  const [favoriteFilter, setFavoriteFilter] = useState(false); //お気に入りフィルター
  const [cookedFilter, setCookedFilter] = useState(false); //作ったことあるフィルター

  const [isBulkMode, setIsBulkMode] = useState(false); //一括操作モード
  const [confirmOpen, setConfirmOpen] = useState(false); //削除確認モーダル
  const [selectedIds, setSelectedIds] = useState<string[]>([]); //一括選択モードで選択されているレシピ

  //レシピ情報を取得
  //mutateはもう一度fetch("/api/recipes")する（これによってUIが更新）
  const { recipes, isLoading, isError, mutate } = useRecipes({
    //レンダリング時に毎回実行されるもの（setStateされ再レンダリング後に実行）
    //下記４つがuseRecipesのfilterとして渡される
    keyword,
    category, //選択中のカテゴリが入る
    favorite: favoriteFilter, //意味）APIパラメータ名 : UIのstate
    cooked: cookedFilter,
  });

  //一括削除モード
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return; //selectedIds が空なら何もせず関数を終了

    const res = await fetch('/api/recipes/bulk-delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        //selectedIds を JSON 文字列化して送る
        ids: selectedIds,
      }),
    });

    if (!res.ok) {
      alert('削除に失敗しました');
      return;
    }
    mutate(); // useRecipes のカスタムフックを再実行>最新データを取得→削除済みのレシピが UI から消える
    setSelectedIds([]); // チェック選択状態をリセット
    setIsBulkMode(false); // 一括モード解除→チェックボックス自体も消える
  };

  //モーダル外 スクロール防止
  useBodyScrollLock({ open: RecipeModalOpen });

  if (isLoading) return <Loading />;
  if (!recipes) return <Empty />;
  if (isError) return <ErrorMessage />;

  return (
    <>
      <AddRecipeModalBase
        open={RecipeModalOpen} //RecipeModalOpenをopenという名前で渡している（モーダル開いているかどうかを子コンポーネントに伝えている）
        onClose={() => setRecipeModalOpen(false)}
        mutate={mutate}
      />
      <div className="max-w-3xl mx-auto h-full overflow-hidden flex flex-col ">
        <nav className="flex justify-center border-b-2 md:mb-2 mb-1 shrink-0">
          レシピ一覧
        </nav>

        <div className="p-2 flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* 検索・絞り込み項目 */}
          <SearchBar
            inputKeyword={inputKeyword}
            setInputKeyword={setInputKeyword}
            setKeyword={setKeyword}
            setRecipeModalOpen={setRecipeModalOpen}
            setIsBulkMode={setIsBulkMode}
            isBulkMode={isBulkMode}
          />

          {menuOpen && (
            <>
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
            </>
          )}

          <button
            className="flex justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="mr-4">絞り込みメニュー</span>
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

          {/* レシピ部分だけスクロール */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain mt-1 p-1">
            {/* 一括操作モード */}
            {isBulkMode && (
              <div className="flex items-center mb-5 gap-3">
                <div className="text-sm text-gray200">
                  {selectedIds.length}件選択中
                </div>

                <div className="flex items-center gap-x-4 ml-6">
                  <button
                    type="button"
                    onClick={() => setConfirmOpen(true)}
                    disabled={selectedIds.length === 0}
                    className={`transition${
                      selectedIds.length === 0
                        ? 'opacity-50 grayscale cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <Image
                      src="/images/deleate.png"
                      alt="削除ボタン"
                      width={70}
                      height={70}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIds([]);
                      setIsBulkMode(false);
                    }}
                  >
                    <label className="text-sm">キャンセル</label>
                  </button>
                </div>
              </div>
            )}

            {/* 検索結果ない場合 */}
            {!isLoading && recipes?.length === 0 && (
              <p className="text-center mt-10">
                該当のレシピがありませんでした
              </p>
            )}

            {/* レシピカード */}
            <div className="grid grid-cols-3 gap-2">
              {recipes?.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isBulkMode={isBulkMode}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  mutate={mutate}
                />
              ))}
            </div>
          </div>

          {/* 削除確認ダイアログ */}
          <ConfirmDialog
            open={confirmOpen}
            title="本当に削除しますか？"
            message={`${selectedIds.length}件のレシピを削除します`}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={async () => {
              await handleBulkDelete();
              setConfirmOpen(false);
            }}
          />
        </div>
      </div>
    </>
  );
};
export default RecipesPage;
