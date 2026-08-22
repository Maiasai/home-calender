import Image from 'next/image';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

type Props = {
  onRemoveFromMenu: () => void;
};

const MenuRecipeButton = ({ onRemoveFromMenu }: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button type="button" aria-label="献立メニューを開く">
          <Image
            src="/images/menu-dots-bold.png"
            alt=""
            width={30}
            height={30}
            className="mr-1"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={3}
          className="z-50 w-55 rounded border bg-white p-1 shadow-md"
        >
          <DropdownMenu.Item
            onSelect={onRemoveFromMenu}
            className="cursor-pointer rounded px-4 py-2 text-red-500 outline-none hover:bg-gray-100"
          >
            献立から外す
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default MenuRecipeButton;
