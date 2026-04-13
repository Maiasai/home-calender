//レシピ編集ボタン

'use client'

import Image from "next/image";


const RecipeEditButton = () => {
  return(
    <Image
      src="/images/edit.png"
      alt="編集"
      width={100}
      height={100}
    />
  )
}

export default RecipeEditButton;