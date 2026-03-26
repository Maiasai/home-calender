//レシピ更新ボタン

'use client'

import Image from "next/image";


const RecipeUpdateButton = () => {
  return(
    <Image
      src="/images/update.png"
      alt="更新"
      width={100}
      height={100}

    />
  )
}

export default RecipeUpdateButton;