//レシピ登録モーダル（URLから）

'use client'

type Props = {
  onBack : () => void
}

const AddRecipeUrlModal = ({ onBack } : Props ) => {


return(
  <div>
    <button
      type="button"
      onClick={onBack}
    >
      ＜ 戻る
    </button>

    <p>URLからレシピ登録</p>
  </div>
  
)
}

export default AddRecipeUrlModal;