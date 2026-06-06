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
    <div className="flex items-center text-xs min-w-0 w-full">
      <Image
        src={iconData}
        alt={altData}
        width={15}
        height={15}
        className="shrink-0"
      />
      <span className="ml-1 min-w-0 truncate">{title}</span>
    </div>
  );
};
