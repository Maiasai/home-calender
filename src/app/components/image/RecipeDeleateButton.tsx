//レシピ削除

'use client'

import Image from "next/image";


const RecipeDeleateButton = () => {
  return(
    <Image
      src="/images/deleate.png"
      alt="削除"
      width={70}
      height={70}
    />
  )
}

export default RecipeDeleateButton;