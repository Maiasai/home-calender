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
        <Link key={item.id} href={`/recipes/${item.id}`}>
          <div className="flex items-center text-sm gap-x-2 mb-4">
            <div>
              <Image
                src={iconSrc}
                alt={iconAlt}
                width={20}
                height={20}
                className="mr-1"
              />{' '}
            </div>
            <div className="relative w-full max-w-[180px] aspect-[4/3] overflow-hidden rounded">
              <Image
                src={item.thumbnailUrl ?? '/images/noImage.jpg'}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            {item.title}
          </div>
        </Link>
      ))}
    </>
  );
};
