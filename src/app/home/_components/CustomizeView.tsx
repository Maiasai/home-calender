//献立作成モーダルにてカスタマイズ押下後の画面

'use client'

import { Dispatch, SetStateAction } from "react"
import { SelectedRecipe } from "../_typs/SelectedRecipe"
import { MealTypeExtended } from "../_typs/MealTypeExtended"


type Props = {
  selectedRecipes : SelectedRecipe[]
  setSelectedRecipes : Dispatch<SetStateAction<SelectedRecipe[]>>
  onBack : () => void 
}

const CustomizeView = ({ 
  selectedRecipes,
  setSelectedRecipes,
  onBack
}:Props) => {
  
    //レシピ内のカテゴリを変更、２件以上同じカテゴリ登録できないロジック
    const changeMealType = (id: string, type: MealTypeExtended)=> {//type → 選択されたカテゴリ
      setSelectedRecipes(prev => {

        // 未以外は2件制限
        if (type !== 'UNASSIGNED') {//選択されたカテゴリが UNASSIGNED でない場合
          const count = prev.filter(r => r.mealType === type).length//元々の配列にあるtypeと、入ってきたタイプが同じものがいくつか。
          if (count >= 2) return prev//そのカテゴリにすでに割り当てられているレシピが 2 件以上なら 変更を無視して元の配列を返す
        }

        //対象のレシピだけmealTypeを変更し、新しい配列をmapで作る
        return prev.map(r =>//　r　→　元々の配列からレシピを取り出す
          r.id === id // r.id→元々のレシピid、id→変更したいレシピのID（クリックされたやつ）
            ? { ...r, mealType: type } // ←　一致するidがあったら　→「...r」で元のレシピをコピーして、mealType: type（クリックされたtype）で上書き
            : r
        )
      })
    }

    //未分類チェック
    const hasUnassigned = selectedRecipes.some(r=>
      r.mealType === 'UNASSIGNED'
    )

    const handleSave = () =>{
      if(hasUnassigned ) {
        alert('未分類のレシピがあります')
        return
      }
      try{
        onBack()
      }catch(e){
        alert('保存に失敗しました')
      }
    }

  return(
    <>
      <div className="flex flex-col gap-4">
        <button
          type='button'
          onClick={handleSave}
        >
          <img
            src="/images/save.png"
            alt="保存ボタン"
            width={70}
          />
        </button>

        {selectedRecipes?.map(recipe=>(

          <div
            key={recipe.id}
            className="flex items-center gap-4"
          >

          {/* 画像 */}
          <div className="w-24 aspect-[4/3] overflow-hidden">
            <img
              src = {recipe.thumbnailUrl}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

            <div className="flex flex-col w-full">
              <div>
                {recipe.title}
              </div>


              {/* ラジオボタン */}
              <div className="flex gap-4">
                {['UNASSIGNED','BREAKFAST','LUNCH','DINNER'].map(type=>(
                  <label 
                    key={type}
                    className="flex gap-1"
                  >
                    <input
                      type="radio"
                      name={`meal-${recipe.id}`}//レシピごとに独立したラジオボタンにしている
                      checked={recipe.mealType === type } //今何が選ばれているか（recipe.mealTypeは親の selectedRecipes 配列から受け取っている）
                      onChange={()=> changeMealType(recipe.id,type as MealTypeExtended)}//クリックされたレシピidと選択肢をchangeMealType に渡す
                    />
                      {type === 'UNASSIGNED' && '未'}
                      {type === 'BREAKFAST' && '朝'}
                      {type === 'LUNCH' && '昼'}
                      {type === 'DINNER' && '晩'}
                  </label>              
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </>
  )
}

export default CustomizeView;