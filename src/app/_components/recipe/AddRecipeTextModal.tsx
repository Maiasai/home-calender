//レシピ登録モーダル（テキストから）

'use client'

type Props = {
  onBack : () => void
}

const AddRecipeTextModal = ({ onBack }: Props ) => {
  return (
    <div>
      <button 
        type="button"
        onClick={onBack}
      >
        ＜ 戻る
      </button>
      
      <p>テキストからレシピ登録</p>
    </div>
  )
}

export default AddRecipeTextModal