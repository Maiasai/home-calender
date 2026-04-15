//【クライアント】ホーム（献立カレンダー）
'use client';

import { useState } from 'react';
import MealModalBase from './_components/MealModalBase';

const TopPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const today = new Date(); //今日の日付を取得

  //今表示している月を管理(Dateは「日付の箱」)※このstateは、今表示している月
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1), //年月を取得しこの形になる　→ new Date(2026, 2, 1)
  );
  //ユーザーがクリックした日を管理（上で取得したtodayを入れることで初期値を本日）
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  //今表示しているカレンダーの情報を取得
  const year = currentMonth.getFullYear(); //年を取得
  const month = currentMonth.getMonth(); //月を取得　※month = 0〜11（1月は0）

  //カレンダーの前の空白を作るために取得(その月の1日を作っている)
  const firstDay = new Date(year, month, 1).getDay(); //firstday=いくつ空白を入れるか //その日が「何曜日か」を数字で返す//（例）日曜日なら0

  const lastDate = new Date(
    //Dateは存在しない日付を指定すると自動で調整してくれる
    //（例）new Date(2026, 3, 0)→意味；2026年4月0日→0日はないから1日前になる※閏年も30,31日も自動対応！
    year,
    month + 1,
    0, //→存在しないので「1日前」に補正される
  ).getDate(); //月末を取得（例だと31だけがlastDateに入る

  //カレンダー1マスずつのデータを入れる配列　※前月、次月を押された時など、毎回作り直される
  const days = []; //ここにnull,date,dateを入れていく

  // 月の最初の空白
  for (let i = 0; i < firstDay; i++) {
    //例）firstdayが水曜日なら3が来る→3回回される
    days.push(null); //水曜日3の場合は0,1,2まで回って終了→[null,null,nullが出来上がる]
  }

  // 1日〜月末までを配列に入れてDateオブジェクトを作る
  for (let i = 1; i <= lastDate; i++) {
    //（例）31が来たら、31回回される　→　1〜31
    days.push(new Date(year, month, i)); //例の場合は[null,null,Date(2026-03-01),〜Date(2026-03-31)]
  }

  //前月に移動（年またぎも自動対応）
  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  //次月に移動（年またぎも自動対応）
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <nav className="flex justify-center border-b-2 max mb-4">
        献立カレンダー
      </nav>

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

      {/* カレンダー(7列、gap-1でマスの間隔) */}
      <div className="grid grid-cols-7 gap-1 auto-rows-[100px]">
        {days.map((date, index) => {
          if (!date) {
            //nullはここに入ってきて、からの配列を作る
            return <div key={index}></div>;
          }

          //選択されている日か判定(クリックされた日付と同じかどうか)
          const isSelected =
            selectedDate && selectedDate.toDateString() === date.toDateString(); //"Mon Mar 10 2026"みたな文字列にして比較

          return (
            //{date.getDate()}→日付だけ取得
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-cols text-center justify-center p-2 rounded text-sm
              ${isSelected ? 'bg-orange-50' : 'hover:bg-gray-100'}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* 選択日 */}

      {selectedDate && (
        <div className="flex justify-between items-center mt-4 p-3 border rounded">
          {selectedDate.toLocaleDateString()} の献立
          <div>
            <button onClick={() => setModalOpen(true)}>
              <img
                src="/images/menucreatebutton.png"
                alt="献立作成ボタン"
                width={80}
              />
            </button>
          </div>
        </div>
      )}

      <MealModalBase
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default TopPage;
