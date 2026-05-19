//献立カレンダーからレシピ選択＞下部に表示されるレシピ詳細箇所UI

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ItemType } from '../_typs/Menu';

type Props = {
  items: ItemType[];
  iconSrc: string;
  iconAlt: string;
};

export const MealSection = ({ items, iconSrc, iconAlt }: Props) => {
  return (
    <>
      {items.map((item) => (
        <div key={item.id} className="flex items-center text-sm gap-x-2 mb-4">
          <div>
            <Image
              src={iconSrc}
              alt={iconAlt}
              width={20}
              height={20}
              className="mr-1"
            />{' '}
          </div>

          <Link href={`/recipes/${item.id}?from=calendar`} className="block">
            <div className="relative  w-[180px] h-[120px]  overflow-hidden rounded">
              <Image
                src={item.thumbnailUrl ?? '/images/noImage.jpg'}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          </Link>

          <Link href={`/recipes/${item.id}?from=calendar`} className="block">
            {item.title}
          </Link>
        </div>
      ))}
    </>
  );
};
