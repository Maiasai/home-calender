//カレンダー表示

'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { MonthData } from '../_typs/Menu';
import { CalendarCell } from '../_typs/CalendarCell';

type Props = {
  data: MonthData;
  days: CalendarCell[];
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
  year: number;
  month: number;
  setCurrentMonth: Dispatch<SetStateAction<Date>>;
};

const Calender = ({
  data,
  days,
  selectedDate,
  setSelectedDate,
  year,
  month,
  setCurrentMonth,
}: Props) => {
  //カレンダー献立（6文字以上カット）
  const truncate = (text: string, length = 5) => {
    return text.length > length ? text.slice(0, length) + '...' : text;
  };

  //前月に移動（年またぎも自動対応）
  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  //次月に移動（年またぎも自動対応）
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <div>
      {/* 月切り替え */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth}>◀</button>
        <h2 className="text-lg font-bold">
          {year}年 {month + 1}月
        </h2>
        <button onClick={nextMonth}>▶</button>
      </div>

      {/* 曜日 */}
      <div className="grid grid-cols-7 text-center text-sm font-semibold mb-2">
        <div>日</div>
        <div>月</div>
        <div>火</div>
        <div>水</div>
        <div>木</div>
        <div>金</div>
        <div>土</div>
      </div>

      <div className="grid grid-cols-7 auto-rows-[100px] mb-2">
        {days.map((date, index) => {
          if (!date) {
            //nullはここに入ってきて、からの配列を作る
            return <div key={index}></div>;
          }
          //カレンダーの各セルの日付ごとに取得
          const dateKey = date.toLocaleDateString('sv-SE'); //カレンダー１マスずつ処理して入ってきた日付をキーに変換
          const dayData = data?.[dateKey]; //APIの結果dataから「その日のデータだけ取る」(例)data["2026-04-15"]

          //選択されている日か判定(クリックされた日付と同じかどうか)
          const isSelected =
            selectedDate && selectedDate.toDateString() === date.toDateString(); //"Mon Mar 10 2026"みたな文字列にして比較

          return (
            //{date.getDate()}→日付だけ取得
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-cols text-center justify-center p-2 rounded text-sm border
                ${isSelected ? 'bg-orange-50' : 'hover:bg-gray-100'}
                `}
            >
              <div className="w-full">
                {date.getDate()}

                {/* 朝 */}
                <div className="mt-3">
                  <div>
                    {dayData?.breakfast.map((databreak) => (
                      <div
                        key={databreak.id}
                        className="flex items-center text-xs"
                      >
                        <Image
                          src="/images/morningIcon.png"
                          alt="朝アイコン"
                          width={15}
                          height={15}
                          className="mr-1"
                        />
                        {truncate(databreak.title)}
                      </div>
                    ))}
                  </div>

                  {/* 昼 */}
                  <div>
                    {dayData?.lunch.map((datalunch) => (
                      <div
                        key={datalunch.id}
                        className="flex items-center text-xs"
                      >
                        <Image
                          src="/images/daytimeIcon.png"
                          alt="昼アイコン"
                          width={15}
                          height={15}
                          className="mr-1"
                        />
                        {truncate(datalunch.title)}
                      </div>
                    ))}
                  </div>

                  {/* 夜 */}
                  <div>
                    {dayData?.dinner.map((datadinner) => (
                      <div
                        key={datadinner.id}
                        className="flex items-center text-xs"
                      >
                        <Image
                          src="/images/nightIcon.png"
                          alt="夜アイコン"
                          width={15}
                          height={15}
                          className="mr-1"
                        />
                        {truncate(datadinner.title)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calender;
