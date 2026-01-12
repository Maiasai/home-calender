//【クライアント】全ページ共通ヘッダー

import Link from "next/link";

const header = () =>{
  
  return(
    <nav className="mt-20 w-full">
      <div className="flex justify-center w-[1200px] mx-auto">
      <Link href="/">献立</Link>
      <Link href="/">レシピ</Link>
      <Link href="/">買い物リスト</Link>
      <Link href="/">マイページ</Link>
      </div>
    </nav>

  )

}


export default header;