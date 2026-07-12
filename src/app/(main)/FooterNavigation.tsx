'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FooterNavigation = () => {
  const pathname = usePathname();

  return (
    <footer className="inset-x-0 bottom-0 z-[9999] isolate h-20 border-t bg-white md:hidden">
      <nav className="flex h-full w-full items-stretch">
        <Link
          href="/home"
          className={`flex h-full flex-1 flex-col items-center justify-center gap-1 text-xs ${
            pathname === '/home' ? 'text-[#fb923c] font-bold' : 'text-[#999999]'
          }`}
        >
          <Image
            src={
              pathname === '/home'
                ? '/images/carendericon.png'
                : '/images/carendericon2.png'
            }
            alt="献立アイコン"
            width={24}
            height={24}
            className="object-contain"
          />
          <span>献立</span>
        </Link>

        <Link
          href="/recipes"
          className={`flex h-full flex-1 flex-col items-center justify-center gap-1 text-xs ${
            pathname === '/recipes'
              ? 'text-[#fb923c] font-bold'
              : 'text-[#999999]'
          }`}
        >
          <Image
            src={
              pathname === '/recipes'
                ? '/images/recipeicon.png'
                : '/images/recipeicon2.png'
            }
            alt="レシピアイコン"
            width={24}
            height={24}
            className="object-contain"
          />
          <span>レシピ</span>
        </Link>

        <Link
          href="/list"
          className={`flex h-full flex-1 flex-col items-center justify-center gap-1 text-xs ${
            pathname === '/list' ? 'text-[#fb923c] font-bold' : 'text-[#999999]'
          }`}
        >
          <Image
            src={
              pathname === '/list'
                ? '/images/carticon.png'
                : '/images/carticon2.png'
            }
            alt="買い物リストアイコン"
            width={24}
            height={24}
            className="object-contain"
          />
          <span>買い物</span>
        </Link>
      </nav>
    </footer>
  );
};
export default FooterNavigation;
