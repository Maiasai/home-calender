//レシピ一覧ページ
//命名メモ　DB（hasCooked),API内部,(isCooked),URLパラメータ(cooked),UIstate(cookedFilter)
//DBとAPI内部(isFavorite),URLパラメータ(favorite),UIstate(favoriteFilter)


"use client";
import AddRecipeModalBase from "@/app/_components/recipe/AddRecipeModalBase";
import { useRecipes } from "@/app/_components/recipe/hooks/useRecipes";
import React, { useEffect, useState } from "react";
import { CategoryFilter } from "@/app/_components/recipe/_types/CategoryFilter";
import ConfirmDialog from "@/app/_components/recipe/components/ConfirmDialog";
import SearchBar from "@/app/_components/recipe/components/SearchBar";
import CategoryFilterButtons from "@/app/_components/recipe/components/CategoryFilterButtons";
import RecipeCard from "@/app/_components/recipe/components/RecipeCard";
import FilterPanel from "@/app/_components/recipe/components/FilterPanel";
import Image from "next/image";
import { supabase } from "@/_libs/supabase";


const RecipesPage = () => {
  const [ RecipeModalOpen , setRecipeModalOpen ] = useState(false);

  const [ category, setCategory ] = useState<CategoryFilter>("");// "" は「すべて」
  const [ inputKeyword,setInputKeyword ] = useState("")//→ 入力中
  const [ keyword, setKeyword ] = useState("");//→検索
  const [ isBulkMode,setIsBulkMode ] = useState(false)//一括操作モード
  const [ confirmOpen,setConfirmOpen ] = useState(false)//削除確認モーダル
  const [ selectedIds, setSelectedIds ] = useState<string[]>([])
  const [ favoriteFilter, setFavoriteFilter ] = useState(false);//お気に入りフィルター
  const [ cookedFilter, setCookedFilter ] = useState(false);//作ったことあるフィルター



  //レシピ情報を取得
  //mutateはもう一度fetch("/api/recipes")する（これによってUIが更新）
  const { recipes , isLoading , isError , mutate } = useRecipes({//レンダリング時に毎回実行されるもの（setStateされ再レンダリング後に実行）
    keyword,
    category,//選択中のカテゴリが入る
    favorite:favoriteFilter,//意味）APIパラメータ名 : UIのstate
    cooked:cookedFilter
  });    

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      console.log("ログインチェック", user)
      console.log(await supabase.auth.getSession())
    }
  
    checkUser()
  }, [])

  //一括削除モード
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;//selectedIds が空なら何もせず関数を終了

    const res = await fetch("/api/recipes/bulk-delete",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({//selectedIds を JSON 文字列化して送る
        ids: selectedIds
      })
    })
    console.log("fetch returned status:", res.status); // ←HTTP ステータスコードを確認
    const data = await res.json();
    console.log("bulk-delete response:", data);

    
    if (!res.ok) {
      alert("削除に失敗しました");
      return;
    }
    mutate() // useRecipes のカスタムフックを再実行>最新データを取得→削除済みのレシピが UI から消える
    setSelectedIds([])// チェック選択状態をリセット
    setIsBulkMode(false)// 一括モード解除→チェックボックス自体も消える
  }


  if(isLoading) return <p>読み込み中...</p>
  if(isError) return <p>エラーが発生しました...</p>

  return(
    <>
      <AddRecipeModalBase
        open={RecipeModalOpen}//RecipeModalOpenをopenという名前で渡している（モーダル開いているかどうかを子コンポーネントに伝えている）
        onClose={()=>setRecipeModalOpen(false)}
      />

      <div className="max-w-3xl mx-auto">
        <nav className="flex justify-center border-b-2 max mb-4">
          レシピ一覧
        </nav>

        {/* 検索・絞り込み項目 */}
        <SearchBar
          inputKeyword={inputKeyword}
          setInputKeyword={setInputKeyword}
          setKeyword={setKeyword}
          setRecipeModalOpen={setRecipeModalOpen}
          setIsBulkMode={setIsBulkMode}
          isBulkMode={isBulkMode}
        />
        
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

        {/* 検索結果ない場合 */}
        {!isLoading && recipes?.length === 0 && (
        <p className="text-center mt-4">該当のレシピがありませんでした</p>
        )}

        {/* 一括操作モード */}
        {isBulkMode && (
        <div className="flex items-center mb-5 gap-3">
          <div className="text-sm text-gray200">
            {selectedIds.length}件選択中
          </div>

            <div className="flex items-center gap-x-4 ml-6">

              <button
                type="button"
                onClick={()=>setConfirmOpen(true)}
                disabled={selectedIds.length === 0}
                className={`transition${
                  selectedIds.length === 0 ? "opacity-50 grayscale cursor-not-allowed" : ""
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
                onClick={()=>{
                  setSelectedIds([])
                  setIsBulkMode(false)
                }}
              >
                <label className="text-sm">キャンセル</label>
              </button>

            </div>
        </div>
        )}  

        {/* レシピカード */}
        <div className="grid grid-cols-3 gap-6">
          { recipes?.map ( (recipe) => (
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
        
        {/* 削除確認ダイアログ */}
        <ConfirmDialog
          open={confirmOpen}
          title="本当に削除しますか？"
          message={`${selectedIds.length}件のレシピを削除します`}
          onCancel={()=>setConfirmOpen(false)}
          onConfirm={async ()=>{
            await handleBulkDelete()
            setConfirmOpen(false)
          }}
        />   

      </div>
    </>
  )
}
export default RecipesPage;