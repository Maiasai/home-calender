//レシピ登録内　入力欄削除アイコン

'use client'


type Props = { 
  size? : number;
}

const DeleteIcon = ( { size = 16 } : Props ) => {
  return(
    <img
      src="/images/Frame174.png"
      alt="削除アイコン"
      width={size}
      height={size}
    />
  )
}

export default DeleteIcon;