//Googleで続ける押下→signInWithGoogle.tsxが走る
// ＞ユーザー処理が完了したら＞supabaseがリダイレクトしてここに飛ぶ。

//コード交換とユーザー取得だけをするページ
// Supabase OAuth から直接アクセスされる URL

'use client';

import { useEffect } from 'react';
import { useAuthCallback } from './useAuthCallback';
import { useRouter } from 'next/navigation';

const AuthCallbackPage = () => {
  const handleAuthCallback = useAuthCallback();
  const router = useRouter();

  useEffect(() => {
    //②レンダー終わった後にuseEffect発火
    //開発環境ではテストのため2回実行される（本番は１回）→URLにcodeがある時だけ実行
    if (!window.location.href.includes('code=')) return;
    handleAuthCallback({
      //③ここの関数が実行
      setLoading: (v: boolean) => console.log('loading', v),
      onSignupOpen: () => {
        // ここで / に戻す + ?signup=1 でモーダル開くフラグを渡す
        router.push('/?signup=1');
      },
      onLoginSuccess: () => router.push('/home'),
    });
  }, []); //callbackページは1回しか使わないから依存配列はなし

  return <p>ログイン処理中...</p>; //①初回レンダー
};

export default AuthCallbackPage;
