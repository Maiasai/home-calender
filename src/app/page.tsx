'use client';

import { useState } from 'react';
import Image from 'next/image';
import LoginFlowModal from './login/_components/LoginFlowModal';

const Home = () => {
  const [LoginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <div>
      {/* 背景画像 */}
      <div className="relative min-h-screen">
        {/* 左下 */}
        <Image
          src="/images/backimgTOP.png"
          className="fixed bottom-0 left-0 w-[300px] opacity-20 pointer-events-none"
          alt="TOP画像左下"
          width={300}
          height={200}
        />

        {/* 右上 */}
        <Image
          src="/images/backimgTOP.png"
          className="fixed top-0 right-0 w-[300px] opacity-20 pointer-events-none"
          alt="TOP画像右上"
          width={300}
          height={200}
        />

        {/* コンテンツ */}
        <div>
          {/* 中身 */}
          <div className="flex justify-center mb-6 mt-16 z-20">
            <Image
              src="/images/rogo.png"
              alt="サイトのロゴ"
              width={233}
              height={51}
            />
          </div>

          {/* 文章 */}
          <p className="whitespace-pre-line text-center mb-10 font-hui">
            {`毎日の献立づくりを、もっとかんたんに。
            ブラウザですぐ使える献立管理Webアプリです。

            保存したレシピをもとに栄養バランスをチェックしながら、
            献立作成や買い物管理をまとめて行えます。


            このアプリでできること

            ■ 献立カレンダー

            レシピ一覧から献立を簡単に作成。
            日ごと・週ごとの予定を見や
            すく管理できます。

            ■ レシピから栄養バランスを自動分析

            登録したレシピの材料・特徴から、
            「偏り」「不足」「バランス」などを自動で診断。
            難しい数値なしで、ひと目で分かります。


            ■ レシピ取り込み（URL / テキスト）

            料理サイトのURLを貼るだけでレシピを保存。
            手元のメモやオリジナルレシピも、
            テキストで簡単に登録できます。


            ■ 買い物リストを自動作成

            献立に使う材料から買い物リストを生成。
            グループメンバーと共有して一緒に管理できます。


            ■ グループ共有

            家族・同居人と献立や買い物リストを共同管理。
            リアルタイム同期で買い忘れを防ぎます。



            今日から献立づくりをもっとラクにしませんか？`}
          </p>
          <div className="flex justify-center mb-6">
            <button //開くボタン
              onClick={() => setLoginModalOpen(true)}
            >
              <Image
                src="/images/loginRegistrationbutton.png"
                alt="新規登録　またはログイン"
                width={200}
                height={50}
              />
            </button>
          </div>

          <LoginFlowModal //モーダル箇所
            open={LoginModalOpen} //今モーダル開いているかどうかの現在の状態そのものを渡してる
            onClose={() => setLoginModalOpen(false)} //呼ばれたらloginModalOpenをfalseにして
            setLoginModalOpen={setLoginModalOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
