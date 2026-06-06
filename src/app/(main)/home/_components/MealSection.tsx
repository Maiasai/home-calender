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
        <div key={item.id} className="flex items-center text-sm gap-x-2 mb-4 ">
          <div className="shink-0">
            <Image
              src={iconSrc}
              alt={iconAlt}
              width={30}
              height={30}
              className="object-contain"
            />{' '}
          </div>

          <Link
            href={`/recipes/${item.id}?from=calendar`}
            className="block shink-0"
          >
            <div className="relative  w-[150px] h-[100px]  overflow-hidden rounded-md">
              <Image
                src={item.thumbnailUrl ?? '/images/noImage.jpg'}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          </Link>

          <Link
            href={`/recipes/${item.id}?from=calendar`}
            className="flex-1 min-w-0 break-words"
          >
            {item.title}
          </Link>
        </div>
      ))}
    </>
  );
};
