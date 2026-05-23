//カレンダー　マス目内UI用
'use client';

import Image from 'next/image';

type Props = {
  iconData: string;
  altData: string;
  title: string;
};

export const CalenderUi = ({ iconData, altData, title }: Props) => {
  return (
    <div className="flex items-center text-xs">
      <Image src={iconData} alt={altData} width={15} height={15} />
      <span className="ml-1 overflow-hidden whitespace-nowrap sm:text-ellipsis">
        {title}
      </span>
    </div>
  );
};
