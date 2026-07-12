'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FooterNavigation = () => {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
      <nav className="flex justify-around py-5 items-center">
        <Link
          href="/home"
          className={`flex flex-col items-center gap-1 text-xs ${
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
          <label>献立</label>
        </Link>

        <Link
          href="/recipes"
          className={`flex flex-col items-center gap-1 text-xs ${
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
          <label>レシピ</label>
        </Link>

        <Link
          href="/list"
          className={`flex flex-col items-center gap-1 text-xs ${
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
          <label>買い物</label>
        </Link>
      </nav>
    </footer>
  );
};
export default FooterNavigation;
