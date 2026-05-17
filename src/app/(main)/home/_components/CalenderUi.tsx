//カレンダー　マス目内UI用
'use client';

import Image from 'next/image';
import { truncateCalendarTitle } from '@/utils/format';

type Props = {
  iconData: string;
  altData: string;
  title: string;
};

export const CalenderUi = ({ iconData, altData, title }: Props) => {
  return (
    <div className="flex items-center text-xs">
      <Image
        src={iconData}
        alt={altData}
        width={15}
        height={15}
        className="mr-1"
      />
      {truncateCalendarTitle(title)}
    </div>
  );
};
