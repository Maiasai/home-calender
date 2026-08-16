//カレンダー表示

'use client';

import { Dispatch, SetStateAction } from 'react';
import { MonthData } from '../_typs/Menu';
import { CalendarCell } from '../_typs/CalendarCell';

type Props = {
  data: MonthData;
  days: CalendarCell[];
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
};

const Calender = ({ data, days, selectedDate, setSelectedDate }: Props) => {
  return (
    <div className="border border-gray-100 shadow-lg">
      {/* 曜日 */}
      <div className="grid grid-cols-7 text-center text-sm font-semibold border border-gray-100">
        <div className="text-red-500">日</div>
        <div>月</div>
        <div>火</div>
        <div>水</div>
        <div>木</div>
        <div>金</div>
        <div className="text-blue-500">土</div>
      </div>

      <div className="grid grid-cols-7 auto-rows-[100px]">
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
              className={`flex flex-col text-center rounded text-sm border p-1
                ${isSelected ? 'bg-orange-50' : 'hover:bg-gray-100'}
                `}
            >
              <div className="w-full">
                {date.getDate()}

                {/* 朝 */}
                <div className="mt-1">
                  <div>
                    {dayData?.breakfast.map((databreak, index) => {
                      if (index === 0) {
                        return (
                          <div
                            key={databreak.id}
                            className="w-full h-full bg-yellow-100 text-yellow-500 text-sm font-bold rounded-lg"
                          >
                            朝
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* 昼 */}
                  <div>
                    {dayData?.lunch.map((datalunch, index) => {
                      if (index === 0) {
                        return (
                          <div
                            key={datalunch.id}
                            className="w-full h-full bg-red-100 text-red-400 text-sm font-bold rounded-lg"
                          >
                            昼
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* 夜 */}

                  <div>
                    {dayData?.dinner.map((datadinner, index) => {
                      if (index === 0) {
                        return (
                          <div
                            key={datadinner.id}
                            className="w-full h-full bg-purple-100 text-purple-400 text-sm font-bold rounded-lg"
                          >
                            夜
                          </div>
                        );
                      }
                      return null;
                    })}
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
