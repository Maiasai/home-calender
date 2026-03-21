//ページタイトル　スタイル管理用コンポーネント

'use client'

type PageTitleProps = { 
  children : React.ReactNode
}

const PageTitle = ({ children }:PageTitleProps) => {
return(
  <h1
    className="w-full border-b text-xl text-center text-gray-400 my-4"
  >
    { children }
  </h1>

)
}

export default PageTitle;