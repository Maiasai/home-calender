//閉じるボタン

'use client';

import Image from 'next/image';

type Props = {
  onClose: () => void;
};

const CloseButton = ({ onClose }: Props) => {
  return (
    <div className="mb-8">
      <button className="absolute top-2 right-3" onClick={onClose}>
        <Image
          src="/images/close01.png"
          alt="閉じるボタン"
          width={30}
          height={30}
        />
      </button>
    </div>
  );
};

export default CloseButton;
