//献立作成モーダル（UI）　献立作成ボタン押下後に表示されるモーダル

'use client'

import { Dispatch, SetStateAction } from "react";
import { MealModalStep } from "../_typs/MealModalStep";
import { SelectedRecipe } from "../_typs/SelectedRecipe";
import { MealType } from "../_typs/MealType";



type Props = {
  onSelect : (step:MealModalStep) => void
  selectedRecipes : SelectedRecipe[]
  setSelectedRecipes : Dispatch<SetStateAction<SelectedRecipe[]>>
  onClose: () => void
  selectedDate : Date
}

const MealModal = ({ 
  onSelect,
  selectedRecipes,
  setSelectedRecipes,
  onClose,
  selectedDate
}:Props) => {
  
  //カテゴリアイコン
  const getMealIcon = ( type:MealType ) => {
    switch (type) {
      case 'BREAKFAST' :
        return "/images/morningIcon.png"
      case 'LUNCH' :
        return "/images/daytimeIcon.png"
      case 'DINNER' :
        return "/images/nightIcon.png"  
      case 'UNASSIGNED' :
        return "/images/nullIcon.png"  
      default:
        return null 
    }
  }

  //カテゴリ分け　外枠
  const categories: MealType[] = ['BREAKFAST', 'LUNCH', 'DINNER','UNASSIGNED']


  const onSubmit = async()=> {
    try{
      console.log('payload前', selectedRecipes)
      const payload = {//API側でユーザーの特定をしているためuser.idはここでは不要
        date : selectedDate,
        recipes : selectedRecipes.map((r,index)=>({//フロント側でmapすることで、API側でmap不要
          recipeId : r.id,
          mealType : r.mealType,
          position: index,
        }))
      }
      console.log('payload後', selectedRecipes)

      const res = await fetch ('/api/meal-plan',{
        method : 'POST',
        headers : {
          'Content-Type':'application/json'
        },
          body : JSON.stringify(payload)
        }
      )

      if(!res.ok){
        throw new Error('保存失敗')
      }

      onClose()//成功時

    }catch(error){
      console.error(error)
    }
  }


  return(
    <>
      <div className="flex">

        <button onClick={onSubmit}>
          登録
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <button onClick={()=>onSelect('customize')}>
            <img
              src="/images/customize.png"
              alt="カスタマイズ"
              width={100}
            />
          </button>


          <button onClick={()=>onSelect('recipeSelect')}>
            <img
              src="/images/selectfromrecipe.png"
              alt="レシピから選択"
              width={120}
            />
          </button>
        </div>
      </div>


      <div>
        {/* カテゴリごとにUIを作っている */}
        {categories.map(category=>{
          //selectedRecipesから1件ずつ取り出して一致するか見てる
          const recipesInCategory = selectedRecipes.filter(r=>r.mealType === category)//この時点でカテゴリごとにレシピが分類される
          if (recipesInCategory.length === 0) return null//そのカテゴリにレシピが1件もなかったら、カテゴリごと表示しない

          return ( 
            <div key={category}>

              <img
                src={getMealIcon(category) ?? undefined}
                className="w-6 h-6 my-2"
                width={20}
              />

              {/* レシピ画像とタイトル */}
              <div className="flex flex-col gap-4">
                  {recipesInCategory?.map(r=>(
                      
                    <div
                      key={r.id}
                      className="flex items-center gap-6"
                    >

                      {/* 画像 */}
                      <div className="w-24 aspect-[4/3] overflow-hidden">
                        <img
                          src = {r.thumbnailUrl}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* タイトル*/}
                      <div>
                        {r.title}
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default MealModal;