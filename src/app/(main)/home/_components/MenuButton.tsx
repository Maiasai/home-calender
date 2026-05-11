//献立詳細内　メニュー(UTと開閉のみ)

'use client';

import Image from 'next/image';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  onList: () => void;
  onNutrition: () => void;
};

const MenuButton = ({ onEdit, onDelete, onList, onNutrition }: Props) => {
  return (
    <DropdownMenu.Root>
      {/* ↑メニュー全体の管理者 */}

      {/* 開くボタン（これ押したらメニュー開くボタンですという宣言） */}
      {/* asChild→子要素(button)をそのままTriggerとして使うという意味 */}
      <DropdownMenu.Trigger asChild>
        <button type="button">
          <Image
            src="/images/menubutton.png"
            alt="メニューアイコン"
            width={30}
            height={30}
            className="mr-1"
          />
        </button>
      </DropdownMenu.Trigger>

      {/* ↓メニュー本体。　DropdownMenu.Portal→メニューを画面の上層レイヤーに出す */}
      <DropdownMenu.Portal>
        {/* ↓これが実際に開く白い箱 */}
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-48 rounded border bg-white p-1 shadow-md"
        >
          {/* 編集 */}
          <DropdownMenu.Item
            onSelect={onEdit}
            className="cursor-pointer rounded px-4 py-2 outline-none hover:bg-gray-100"
          >
            献立編集
          </DropdownMenu.Item>

          {/* 買い物リスト追加 */}
          <DropdownMenu.Item
            onSelect={onList}
            className="cursor-pointer rounded px-4 py-2 outline-none hover:bg-gray-100"
          >
            買い物リストに追加
          </DropdownMenu.Item>

          {/* 栄養バランス */}
          <DropdownMenu.Item
            onSelect={onNutrition}
            className="cursor-pointer rounded px-4 py-2 outline-none hover:bg-gray-100"
          >
            栄養バランスを見る
          </DropdownMenu.Item>

          {/* 区切り線 */}
          <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />

          {/* 削除 */}
          <DropdownMenu.Item
            onSelect={onDelete}
            className="cursor-pointer rounded px-4 py-2 text-red-500 outline-none hover:bg-gray-100"
          >
            献立削除
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default MenuButton;
