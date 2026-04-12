//閉じるボタン

'use client'

import Image from "next/image"

type Props = {
  onClose : () => void;
}

const CloseButton = ({
  onClose
}:Props) => {

  return(
    <button
      className="absolute top-6 right-6"
      onClick={onClose}
    >
      <Image
        src="/images/close01.png"
        alt="閉じるボタン"
        width={18}
        height={18}
      />
    </button>
  )
}

export default CloseButton;