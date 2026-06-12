//閉じるボタン

'use client';

import Image from 'next/image';

type Props = {
  onClose: () => void;
};

const CloseButton = ({ onClose }: Props) => {
  return (
    <button onClick={onClose}>
      <Image
        src="/images/close01.png"
        alt="閉じるボタン"
        width={30}
        height={30}
      />
    </button>
  );
};

export default CloseButton;
