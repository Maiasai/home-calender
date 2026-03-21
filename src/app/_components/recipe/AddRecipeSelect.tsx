//レシピ一覧からレシピ追加＞開くモーダル

'use client'

import { RecipeModalStep } from "@/app/_components/recipe/_types/RecipeModalStep"
import AddRecipeModalBase from "./AddRecipeModalBase"
import { useState } from "react"



type Props = {
  onSelect : (step:RecipeModalStep) => void
}

const AddRecipeSelect = ({ onSelect}:Props) => {
  const [RecipeModalOpen,setRecipeModalOpen] = useState(false)

return(
  <div className="bg-gray-100 w-[600px] max-h-[60vh] overflow-y-auto">
    <div className="flex flex-col gap-3 m-3">

      
    <AddRecipeModalBase
      open={RecipeModalOpen}            // モーダル表示/非表示の state
      onClose={() => setRecipeModalOpen(false)}  // 閉じるボタン押したときに state を false にする
    />

    {/* URLから追加する */}
    <div className="flex flex-col h-[90px] bg-white  mx-4 mt-4 mb-2 p-4 rounded-lg">
      <button
        type="button"
        onClick={()=>onSelect('URL')}//baseコンポーネントに次はURL画面にしてと依頼
        className="flex items-center gap-4 text-left"
      >
        {/* 左アイコン */}
        <div>
          <img
            src="/images/link.png"
            alt="URLから追加するアイコン"
            width={40}
          />
        </div>
        
        {/* 右テキスト */}
        <div className="flex flex-col">
          <div>URLから追加する</div>
          <div className="text-sm">WebサイトのレシピURLを貼るだけで、自動で内容を取り込みます。</div>
        </div>
      </button>
    </div>



    {/* テキストからレシピを登録する */}
    <div className="flex flex-col h-[90px] bg-white  mx-4 mb-2 p-4 rounded-lg">
      <button
        type="button"
        onClick={()=>onSelect('TEXT')}
        className="flex items-center gap-4 text-left"
      >
        {/* 左アイコン */}
        <div>
          <img
            src="/images/text.png"
            alt="テキストからレシピを登録するアイコン"
            width={40}
          />
        </div>

        {/* 右テキスト */}
        <div className="flex flex-col">
          <div>テキストからレシピを登録する</div>
          <div className="text-sm">材料や作り方をテキストで貼り付けると、自動でレシピとして整理されます。</div>
        </div>
      </button>
    </div>

    {/* オリジナルレシピを登録する */}
    <div className="flex flex-col h-[80px] gap-6 bg-white mx-4 mb-4 p-4 rounded-lg">
      <button
        type="button"
        onClick={()=>onSelect('MANUAL')}
        className="flex items-center gap-4 text-left"
      >
        {/* 左アイコン */}
        <div>
          <img
            src="/images/pen.png"
            alt="オリジナルレシピを登録するアイコン"
            width={40}
          />
        </div>

        {/* 右テキスト */}
        <div className="flex flex-col">
          <div>オリジナルレシピを登録する</div>
          <div className="text-sm">自分で作ったレシピを、材料・手順を入力して自由に登録できます。</div>
        </div>
      </button>
    </div>
    </div>
  </div>
)
}

export default AddRecipeSelect;