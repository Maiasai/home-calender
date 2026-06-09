//autg/callback/page.tsxから呼び出される関数
//Google専用関数（Googleでログインできた後に実行）
//Googleログインの結果を受け取って、アプリの状態に反映する

'use client';

import { GetMeResponse } from '@/app/api/_types/ApiResponse';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type Options = {
  onSignupOpen?: () => void;
  setLoading?: (v: boolean) => void;
  onLoginSuccess?: () => void;
  onAuthComplete?: (data: {
    provider: AuthProvider;
    isGoogleUser: boolean;
  }) => void;
};
type AuthProvider = 'google' | 'email' | null;

export const useAuthCallback = () => {
  const router = useRouter();

  //options→関数をまとめて渡すためのオブジェクト
  const handleAuthCallback = async (options?: Options) => {
    options?.setLoading?.(true);

    try {
      //①GoogleがユーザーOK→一時的なコードを発行
      const code = new URL(window.location.href).searchParams.get('code');

      if (!code) {
        router.push('/');
        return;
      }

      const {
        data: { session },

        error: exchangeError,
      } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError || !session?.access_token) {
        console.error(exchangeError);

        router.push('/');

        return;
      }
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      const authProviders = user?.app_metadata?.providers;

      const isGoogleUser =
        user?.app_metadata?.provider === 'google' ||
        (Array.isArray(authProviders) && authProviders.includes('google'));

      const provider: AuthProvider = isGoogleUser ? 'google' : 'email';

      if (userError || !user) {
        //「エラーがある」または「ユーザーが取得できなかった」とき
        router.push('/');
        return;
      }

      const syncRes = await fetch('/api/auth/sync-user', {
        //③Supabaseのユーザー → DBに同期
        //※前提としてSupabase Authには自動保存されるが、Prismaで触るSupabase Databaseには保存されない
        //そのため、ここで同期処理が必要となる
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          provider,
        }),
      });

      //④DBにユーザーいるか確認
      const res = await fetch('/api/users/me', {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      //意味）もし onAuthComplete が渡されてたら、その関数を今ここで実行する
      options?.onAuthComplete?.({
        provider: provider,
        isGoogleUser,
      });

      const data: GetMeResponse = await res.json();

      const needsNickname =
        data.user && (!data.user.nickname || data.user.nickname.trim() === '');

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
