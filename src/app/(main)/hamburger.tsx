//ハンバーガーメニュー

import { useBodyScrollLock } from '@/components/_hooks/useBodyScrollLock';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
};

export const Hamburger = ({ open, setOpen, handleLogout }: Props) => {
  //メニュー開いた時、メニュー外スクロール不可にする
  useBodyScrollLock({ open });

  return (
    <div>
      {/* ハンバーガー */}
      <button
        onClick={() => setOpen(!open)}
        className="relative z-50 md:hidden flex flex-col gap-1 mt-4 mr-4"
      >
        <>
          <span
            className={`h-0.5 bg-gray-500 transition-all duration-500 ${open ? 'w-5 rotate-45 translate-y-1.5' : 'w-5'}`}
          ></span>
          <span
            className={`w-5 h-0.5 bg-gray-500 ${open ? 'opacity-0 transition-all duration-300 ' : ''}`}
          ></span>
          <span
            className={`h-0.5 bg-gray-500 transition-all duration-500 ${open ? 'w-5 -rotate-45 -translate-y-1.5' : 'w-5'}`}
          ></span>
        </>
      </button>

      {/* スマホメニュー */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      <nav
        className={`fixed top-0 right-0  h-screen bg-white md:hiddentransition-transform duration-700  border border-gray-100 z-40
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col gap-8 mt-20 p-2 m-6">
          <Link
            href="/home"
            onClick={() => setOpen(false)}
            className="w-full ml-3 border-b"
          >
            献立
          </Link>
          <Link
            href="/recipes"
            onClick={() => setOpen(false)}
            className="w-full ml-3 border-b"
          >
            レシピ
          </Link>
          <Link
            href="/list"
            onClick={() => setOpen(false)}
            className="w-full ml-3 border-b"
          >
            買い物リスト
          </Link>
          <Link
            href="/mypage"
            onClick={() => setOpen(false)}
            className="w-full ml-3 border-b"
          >
            マイページ
          </Link>
          <button onClick={handleLogout} className="w-full border-b">
            ログアウト
          </button>
        </div>
      </nav>
    </div>
  );
};
