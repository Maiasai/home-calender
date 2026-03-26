//戻るボタン
'use client'

import Image from "next/image";

const BackIcon = () => {
  return(
    <button
      type="button"
      className="absolute mt-1"
      >
      <Image
        src="/images/back00.png"
        alt="戻る"
        width={18}
        height={18}
      />
    </button>
  )
}

export default BackIcon;