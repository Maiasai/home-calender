//コンポーネントヘッダー
'use client';

import BackIcon from '@/app/components/image/backicon';
import CloseButton from '@/app/components/image/CloseButton';

type Props = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showClose?: boolean;
  onClose?: () => void;
};

const PageHeader = ({
  title,
  showBack = true,
  onBack,
  showClose,
  onClose,
}: Props) => {
  return (
    <div className="relative flex justify-center bg-white px-2 py-2 gap-4 top-0 z-10">
      {/* 戻るボタン（任意） */}
      {showBack && onBack && (
        <button type="button" className="absolute left-2 mb-2" onClick={onBack}>
          <BackIcon />
        </button>
      )}

      {/* タイトル */}
      {title && <h1 className="text-lg font-semibold ml-2">{title}</h1>}

      {/* 閉じるボタン */}
      {showClose && onClose && <CloseButton onClose={onClose} />}
    </div>
  );
};

export default PageHeader;
