//autg/callback/page.tsxから呼び出される関数
//Google専用関数（Googleでログインできた後に実行）
//Googleログインの結果を受け取って、アプリの状態に反映する

'use client';

import { supabase } from '@/lib/supabase';
import { GetMeResponse } from '@/app/api/_types/ApiResponse';
import { useRouter } from 'next/navigation';

type Options = {
  onSignupOpen?: () => void;
  setLoading?: (v: boolean) => void;
  onLoginSuccess?: () => void;
};

export const useAuthCallback = () => {
  const router = useRouter();

  //options→関数をまとめて渡すためのオブジェクト
  const handleAuthCallback = async (options?: Options) => {
    options?.setLoading?.(true);

    try {
      //①GoogleがユーザーOK→一時的なコードを発行
      await supabase.auth.exchangeCodeForSession(window.location.href);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      //②supabaseがGoogleログインのコードをセッションに変換→これによってログイン状態になる

      if (userError || !user) {
        //「エラーがある」または「ユーザーが取得できなかった」とき
        router.push('/');
        return;
      }
      await fetch('/api/auth/sync-user', {
        //③Supabaseのユーザー → DBに同期
        //※前提としてSupabase Authには自動保存されるが、Prismaで触るSupabase Databaseには保存されない
        //そのため、ここで同期処理が必要となる
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          provider: user.app_metadata?.provider,
        }),
      });

      //④DBにユーザーいるか確認
      const res = await fetch('/api/users/me', {
        credentials: 'include', //Googleログインしたユーザーのブラウザに保存されているCookie（セッション情報）も一緒に送る
      });
      const data: GetMeResponse = await res.json();
      console.log('ME RESPONSE:', data.user);
      console.log('NICKNAME:', data.user?.nickname);

      const needsNickname =
        data.user && (!data.user.nickname || data.user.nickname.trim() === '');

      console.log('NEEDS:', needsNickname);
      if (data.user) {
        if (needsNickname) {
          options?.onSignupOpen?.(); // ⑤ユーザーがいて、onLoginSuccessという関数が渡されていたら、その中の処理（mainへ遷移）を実行
          return;
        } else {
          options?.onLoginSuccess?.(); // ← ホームへ
          return;
        }
      } else {
        options?.onSignupOpen?.(); //⑤いなかったら新規登録モーダル
      }
    } finally {
      options?.setLoading?.(false);
    }
  };

  return handleAuthCallback;
};
