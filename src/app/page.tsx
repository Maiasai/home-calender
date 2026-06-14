'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import LoginFlowModal from './login/_components/LoginFlowModal';
import { useBodyScrollLock } from '@/components/_hooks/useBodyScrollLock';
import PrimaryButton from '@/components/button/PrimaryButton';

const Home = () => {
  const [LoginModalOpen, setLoginModalOpen] = useState(false);

  useBodyScrollLock({ open: LoginModalOpen });

  useEffect(() => {
    //URLの # 以降を読む
    const url = new URL(window.location.href);
    const hash = decodeURIComponent(window.location.hash).replaceAll('+', ' ');
    const emailChanged = new URL(window.location.href).searchParams.get(
      'emailChanged',
    );

    //パスワードリセットリンクか判定
    const isReset =
      new URL(window.location.href).searchParams.get('reset') === '1';

    if (emailChanged === 'complete') {
      alert('メールアドレス変更が完了しました');
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }
    // パスワード再設定リンク
    if (isReset) {
      setLoginModalOpen(true);
      return;
    }

    //新規登録：その中に type=signup が含まれているか確認
    if (hash.includes('type=signup')) {
      //sessionStorage に emailConfirmed=true を保存
      sessionStorage.setItem('emailConfirmed', 'true');
      setLoginModalOpen(true);
      return;
    }

    //リンク期限切れ・使用済み
    if (
      hash.includes('otp_expired') ||
      hash.includes('Email link is invalid or has expired')
    ) {
      window.history.replaceState(null, '', window.location.pathname);

      if (!isReset) {
        alert(
          'この確認リンクは期限切れ、またはすでに使用済みです。\nすでにメールアドレス変更が完了している場合は、そのままで大丈夫です。\n変更できていない場合は、もう一度メールアドレス変更をお試しください。',
        );
      }

      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  return (
    <div>
      {/* 背景画像 */}
      <div className="relative min-h-screen z-0">
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
          className="fixed top-0 right-0 w-[300px] opacity-20 pointer-events-none z-0"
          alt="TOP画像右上"
          width={300}
          height={200}
        />

        {/* コンテンツ */}
        <div>
          {/* 中身 */}
          <div className="relative flex justify-center mb-6 mt-16 z-10">
            <Image
              src="/images/rogo.png"
              alt="サイトのロゴ"
              width={233}
              height={51}
            />
          </div>

          {/* 文章 */}
          <p className="relative whitespace-pre-line text-center text-gray-600 mb-10 font-hui z-10 p-2">
            {`毎日の献立づくりを、もっとかんたんに。
            ブラウザですぐ使える献立管理Webアプリです。

            保存したレシピをもとに
            栄養バランスをチェックしながら、
            献立作成や買い物管理をまとめて行えます。


            このアプリでできること

            ■ 献立カレンダー

            レシピ一覧から献立を簡単に作成。
            日ごと・週ごとの予定を
            見やすく管理できます。

            ■ レシピから栄養バランスを自動分析

            登録したレシピをもとに、
            全体のバランスや、
            たんぱく質・野菜の充実度をチェックできます。

            毎日の献立づくりの参考として活用できます。


            ■ レシピ登録（URL / テキスト）

            料理サイトのURLやレシピメモを登録して、
            自分だけのレシピ一覧を作成できます。

            オリジナルレシピもテキスト入力で
            簡単に保存できます。

            ■ 買い物リストを自動作成

            献立に使う材料から買い物リストを生成。

            買うものをまとめて管理できるため、
            買い忘れ防止にも役立ちます。

            ■ グループ共有

            家族や同居人と
            レシピ・献立・買い物リストを
            共有できます。

            共同で編集できるため、
            毎日の食事管理をスムーズに行えます。

            今日から献立づくりをもっとラクにしませんか？`}
          </p>
          <div className="relative flex justify-center mb-6 z-10">
            <PrimaryButton
              onClick={() => setLoginModalOpen(true)}
              className="h-10 px-6"
              variant="primary"
            >
              新規登録　またはログイン
            </PrimaryButton>
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
