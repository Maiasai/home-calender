//①Googleで続ける押下→signInWithGoogle.tsxが走る
// ＞ユーザー処理が完了したら＞supabaseがリダイレクトしてここに飛ぶ。

//コード交換とユーザー取得だけをするページ
// Supabase OAuth から直接アクセスされる URL

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthCallback } from '@/app/login/_hooks/useAuthCallback';

const AuthCallbackPage = () => {
  const authHandler = useAuthCallback(); //②authHandler を“準備”（useAuthCallbackからのログイン処理関数を受け取ってる）
  const router = useRouter();

  useEffect(() => {
    //③レンダー終わった後にuseEffect発火
    const code = new URLSearchParams(window.location.search).get('code');

    if (!code) return;

    authHandler({
      //④useAuthCallbackが返した関数（authHandler）が実行される（ここではルールを渡してるだけ）
      setLoading: (v: boolean) => console.log('loading', v),
      onAuthComplete: ({ provider, isGoogleUser }) => {
        sessionStorage.setItem(
          //ブラウザに一時保存できる仕組み。
          'authResult',
          JSON.stringify({
            provider,
            isGoogleUser,
          }),
        );
      },
      onSignupOpen: () => {
        // ここで / に戻す + ?signup=1 でモーダル開くフラグを渡す
        router.push('/?signup=1');
      },

      onLoginSuccess: () => router.push('/home'),
    });
  }, []); //callbackページは1回しか使わないから依存配列はなし

  return (
    <p className="flex items-center justify-center min-h-screen">
      ログイン処理中...
    </p>
  ); //①初回レンダー
};

export default AuthCallbackPage;
