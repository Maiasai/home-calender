//ハンバーガーメニュー

import { useBodyScrollLock } from '@/components/_hooks/useBodyScrollLock';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
};

export const Setting = ({ open, setOpen, handleLogout }: Props) => {
  //メニュー開いた時、メニュー外スクロール不可にする
  useBodyScrollLock({ open });

  return (
    <div>
      {/* スマホメニュー */}

      {open && (
        <nav className="fixed top-10 right-4  h-[80px] bg-white md:hiddentransition-transform duration-200 rounded-lg  border border-gray-300 z-40">
          <div className="flex flex-col justify-center gap-1">
            <Link
              href="/mypage"
              onClick={() => setOpen(false)}
              className="ml-3 border-b mr-2 mt-2"
            >
              マイページ
            </Link>
            <button onClick={handleLogout} className="border-b mb-2">
              ログアウト
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};
