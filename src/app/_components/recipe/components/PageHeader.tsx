//コンポーネントヘッダー
'use client'

import Image from "next/image"


type Props = {
  title: string
  showBack?: boolean
  onBack?: () => void
  onClose: () => void
}

const PageHeader = ({
  title, showBack = true, onBack , onClose 
}: Props)=> {

  return (
    <div className="relative flex justify-center bg-white px-4 py-4 gap-4 top-0 z-10">

      {/* 戻るボタン（任意） */}
      {showBack && onBack && (
        <button
          type="button"
          className="absolute left-5 mt-1"
          onClick={onBack}
        >
          <Image
            src="/images/back00.png"
            alt="戻る"
            width={18}
            height={18}
          />
      </button>
      )}

      {/* タイトル */}
      <h1 className="text-lg">{title}</h1> 
      
      {/* 閉じるボタン（常に表示） */}
      <button
        className="absolute top-1 right-2"
        onClick={onClose}
      >
        <Image
          src="/images/close01.png"
          alt="閉じるボタン"
          width={18}
          height={18}
        />
      </button>
    </div>
  )
  }

export default PageHeader;