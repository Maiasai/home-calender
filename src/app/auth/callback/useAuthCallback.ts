//autg/callback/page.tsxから呼び出される関数
//Google専用関数（Googleでログインできた後に実行）
//Googleログインの結果を受け取って、アプリの状態に反映する

'use client';

import { supabase } from '@/_libs/supabase';
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
      console.log('🔥 Auth callback start');
      console.log('window.location.href:', window.location.href);

      //①GoogleがユーザーOK→一時的なコードを発行
      await supabase.auth.exchangeCodeForSession(window.location.href);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      //②supabaseがGoogleログインのコードをセッションに変換→これによってログイン状態になる

      console.log('getUser result:', { user, userError });

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
      const data = await res.json();

      if (data.user) {
        console.log('redirecting to /home');
        options?.onLoginSuccess?.(); // ⑤ユーザーがいて、onLoginSuccessという関数が渡されていたら、その中の処理（/homeへ遷移）を実行
      } else {
        console.log('onSingupOpen');
        options?.onSignupOpen?.(); //⑤いなかったら新規登録モーダル
      }
    } finally {
      options?.setLoading?.(false);
    }
  };

  return handleAuthCallback;
};
