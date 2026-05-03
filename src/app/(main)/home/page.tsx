//【クライアント】ホーム（献立カレンダー）
'use client';

import { useState } from 'react';
import MealModalBase from './_components/MealModalBase';
import { fetcher } from '@/lib/featcher';
import useSWR from 'swr';
import { MonthData } from './_typs/Menu';
import Calender from './_components/Calendar';
import { CalendarCell } from './_typs/CalendarCell';
import CalenderSelectedDate from './_components/CalenderSelectedDate';
import { SelectedRecipe } from './_typs/SelectedRecipe';
import { Meal } from './_typs/Meal';
import Image from 'next/image';

const TopPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  //initialRecipesで編集モーダルを開いた瞬間の初期値を管理（編集用）*一切変更しない元データ
  const [initialRecipes, setInitialRecipes] = useState<SelectedRecipe[]>([]); //selectedRecipesを正しく初期化するために存在
  const [targetMeal, setTargetMeal] = useState<Meal | null>(null); //今ユーザーが操作してる作業中の献立データを管理（編集用）

  const today = new Date(); //今日の日付を取得

  //今表示している月を管理(Dateは「日付の箱」)※このstateは、今表示している月
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1), //年月を取得しこの形になる　→ new Dateで今の月の1日を作成(2026, 2, 1)
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
  const days: CalendarCell[] = []; //ここにnull,date,dateを入れていく

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

  //献立取得
  //Date型から文字列に変換（"2026-04-01"）→（"2026-04"）にしてる
  //slice(0, 7)→0以上7未満の文字の一部を切り取る。slice(開始位置, 終了位置)
  const monthdata = currentMonth.toLocaleDateString('sv-SE').slice(0, 7);

  //URLが変わると、その範囲の月の献立が自動取得される
  const { data, mutate } = useSWR<MonthData>(
    `/api/home?month=${monthdata}`,
    fetcher,
  ); //url変えるものではない。APIを叩くための文字列

  //編集ボタン押下時（編集モードでモーダルを開く準備をhandleEditで実施）
  //ここでMeal型だったものを、mapを使ってrecipe内からid,titie,thumbnailUrlを取り出して平らにしている
  const handleEdit = (meal: Meal) => {
    setTargetMeal(meal); // ← 更新対象に初期値セット

    const converted = meal.recipes
      .filter(
        (r, index, self) =>
          index === self.findIndex((x) => x.recipe.id === r.recipe.id),
      )
      .map((r) => ({
        id: r.recipe.id,
        title: r.recipe.title,
        thumbnailUrl: r.recipe.thumbnailUrl,
        mealType: r.mealType,
      }));
    setInitialRecipes(converted); //ここでモーダルの初期値をセット（初期表示データ）
    setMode('edit'); // ← モード切替
    setModalOpen(true); // ← モーダル開く
  };

  //買い物リストへ追加処理
  const handleAddList = async (meal: Meal) => {
    const hasIngredients = meal.recipes.some(
      (r) => r.recipe.ingredients && r.recipe.ingredients.length > 0,
    );
    if (!hasIngredients) {
      alert('材料が登録されていません。編集画面から追加してください');
      return;
    }

    try {
      const res = await fetch('/api/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: meal.id }),
      });

      if (!res.ok) {
        throw new Error('追加に失敗しました');
      }

      const data = await res.json();

      alert('買い物リストに追加しました');
    } catch (error) {
      console.log(error);
      alert('エラーが発生しました');
    }
  };

  //閉じるボタン押下時（モーダル内リセット処理）
  const handleCloseModal = () => {
    setModalOpen(false);
    setMode('create'); // ←新規作成に戻す
    setInitialRecipes([]); // ←モーダル内初期値を初期化
  };

  if (!data)
    return (
      <div className="flex items-center justify-center mt-10">loading...</div>
    );

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <nav className="flex justify-center border-b-2 max mb-4">
        献立カレンダー
      </nav>

      {/* カレンダー(7列、gap-1でマスの間隔) */}
      <Calender
        data={data}
        days={days}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        year={year}
        month={month}
        setCurrentMonth={setCurrentMonth}
      />
      <Image
        src="/images/homeimage.png"
        alt="ホームの画像"
        width={1200}
        height={90}
      />

      {/* 選択日 */}
      {selectedDate && (
        <CalenderSelectedDate
          data={data}
          selectedDate={selectedDate}
          setModalOpen={setModalOpen}
          onEdit={handleEdit} //ユーザーが編集押下＞MenuButtonのonClickが感知→onEditにその日の献立がくっついてここにくる。
          onList={handleAddList}
        />
      )}

      <MealModalBase
        open={modalOpen} //modalOpen === true のとき開く
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        mutate={mutate}
        mode={mode}
        initialRecipes={initialRecipes}
        targetMeal={targetMeal}
      />
    </div>
  );
};

export default TopPage;
