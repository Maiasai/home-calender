//レシピ登録内　入力欄削除アイコン

'use client'

import Image from "next/image";

type Props = { 
  size? : number;
}

const DeleteIcon = ( { size = 16 } : Props ) => {
  return(
    <Image
      src="/images/Frame174.png"
      alt="削除アイコン"
      width={size}
      height={size}
    />
  )
}

export default DeleteIcon;