//献立作成モーダル（切り替え用）

'use client'

import { useState } from "react"
import MealModal from "./MealModal"
import MealRecipeSelect from "./MealRecipeSelect"
import { MealModalStep } from "../_typs/MealModalStep"
import { useRecipes } from "@/app/_components/recipe/hooks/useRecipes"
import { CategoryFilter } from "@/app/_components/recipe/_types/CategoryFilter"
import { SelectedRecipe } from "../_typs/SelectedRecipe"
import CustomizeView from "./CustomizeView"


type Props = {
  open: boolean
  onClose: () => void
  selectedDate : Date
}

const MealModalBase = ({ 
  open,
  onClose,
  selectedDate
}:Props) => {
  
  const [ step , setStep ] = useState<MealModalStep>('select')
  const [ category, setCategory ] = useState<CategoryFilter>("");// "" は「すべて」
  const [ inputKeyword,setInputKeyword ] = useState("")//→ 入力中
  const [ keyword, setKeyword ] = useState("");//→検索
  const [ favoriteFilter, setFavoriteFilter ] = useState(false);//お気に入りフィルター
  const [ cookedFilter, setCookedFilter ] = useState(false);//作ったことあるフィルター
  const [ selectedRecipes , setSelectedRecipes ] = useState<SelectedRecipe[]>([])//選択されたレシピをここで管理（配列の中に、選択済みレシピのオブジェクトが入ってる）
  


  //レシピ情報を取得
  const { recipes , isLoading , isError , mutate } = useRecipes({//レンダリング時に毎回実行されるもの（setStateされ再レンダリング後に実行）
    keyword,
    category,//選択中のカテゴリが入る
    favorite:favoriteFilter,//意味）APIパラメータ名 : UIのstate
    cooked:cookedFilter
  });    
  
  if(!open) return null;

  return(
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

        {/* モーダル内 */}
        <div className="bg-white p-6 rounded w-[400px]">
          <div>
            <h1 className="flex justify-center">献立作成</h1>
            <h2 className="flex justify-center">
              {selectedDate?.toLocaleDateString()} の献立
            </h2>

            <button onClick={onClose}>
              閉じる
            </button>
          </div>

          { step === 'select' && (//ボタンが押されたらstep変更を依頼
            <MealModal 
              selectedRecipes={selectedRecipes}
              setSelectedRecipes={setSelectedRecipes} // 同期用
              onSelect = {setStep}
              onClose={onClose}
              selectedDate={selectedDate}
            /> 
          )}

          { step === 'recipeSelect' && (//ボタンが押されたらstep変更を依頼
            <MealRecipeSelect
              recipes={recipes}
              isLoading={isLoading}
              isError={isError}
              inputKeyword={inputKeyword}
              setInputKeyword={setInputKeyword}
              setKeyword={setKeyword}
              favoriteFilter={favoriteFilter}
              setFavoriteFilter={setFavoriteFilter}
              cookedFilter={cookedFilter}
              setCookedFilter={setCookedFilter}
              category={category}
              setCategory={setCategory}
              selectedRecipes={selectedRecipes}
              setSelectedRecipes={setSelectedRecipes}

              onBack={()=>setStep('select')}
            /> 
          )}

          { step === 'customize' && (//ボタンが押されたらstep変更を依頼
            <CustomizeView
              selectedRecipes={selectedRecipes}
              setSelectedRecipes={setSelectedRecipes}

              onBack={()=>setStep('select')}
            /> 
          )}
        </div>
      </div>
    </>

  )
}

export default MealModalBase;