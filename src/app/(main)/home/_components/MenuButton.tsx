//献立詳細内　メニュー(UTと開閉のみ)

'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  onList: () => void;
};

const MenuButton = ({ onEdit, onDelete, onList }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* ボタン */}
      <button onClick={() => setIsOpen((prev) => !prev)}>
        <Image
          src="/images/menubutton.png"
          alt="メニューアイコン"
          width={30}
          height={30}
          className="mr-1"
        />
      </button>
      {/* オーバーレイ（外クリック用） */}
      {isOpen && ( //画面全体に透明な壁を置いて、クリックで閉じる（外クリックの代わり）
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}

      {/* メニュー */}
      {isOpen && (
        <div className="absolute right-0 z-20 w-48 bg-white border rounded shadow">
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              //押されたら、親に押されたことを通知するだけ
              setIsOpen(false);
              onEdit();
            }}
          >
            献立編集
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              onList();
            }}
          >
            買い物リストに追加
          </button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            栄養バランスを見る
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
          >
            献立削除
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuButton;
