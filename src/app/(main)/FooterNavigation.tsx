'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FooterNavigation = () => {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t bg-white md:hidden">
      <nav className="flex justify-around py-3 items-center">
        <Link
          href="/home"
          className={
            pathname === '/home' ? 'text-[#fb923c] font-bold' : 'text-[#999999]'
          }
        >
          <Image
            src={
              pathname === '/home'
                ? '/images/carendericon.png'
                : '/images/carendericon2.png'
            }
            alt="献立アイコン"
            width={22}
            height={22}
            className="ml-1"
          />
          <label>献立</label>
        </Link>

        <Link
          href="/recipes"
          className={
            pathname === '/recipes'
              ? 'text-[#fb923c] font-bold'
              : 'text-[#999999]'
          }
        >
          <Image
            src={
              pathname === '/recipes'
                ? '/images/recipeicon.png'
                : '/images/recipeicon2.png'
            }
            alt="レシピアイコン"
            width={22}
            height={22}
            className="ml-3"
          />
          <label>レシピ</label>
        </Link>

        <Link
          href="/list"
          className={
            pathname === '/list' ? 'text-[#fb923c] font-bold' : 'text-[#999999]'
          }
        >
          <Image
            src={
              pathname === '/list'
                ? '/images/carticon.png'
                : '/images/carticon2.png'
            }
            alt="買い物リストアイコン"
            width={26}
            height={26}
            className="ml-3"
          />
          <label>買い物</label>
        </Link>
      </nav>
    </footer>
  );
};
export default FooterNavigation;
