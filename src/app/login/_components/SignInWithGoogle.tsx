//Google ログイン(ここでgoogle認証画面へリダイレクト)
'use client';

import { supabase } from '@/lib/supabase';

const signInWithGoogle = async () => {
  alert('google click');

  alert(`origin=${window.location.origin}`);

  alert(`before oauth=${JSON.stringify(Object.keys(localStorage))}`);
  //Googleにログイン認証をお願いする仕組み
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google', //①SupabaseにGoogleログインしたいと伝える→supabaseがGoogleの認証ページに飛ばしてくれる
    //②Googleのログイン画面に飛ばされる→ユーザーがGoogleでログイン→supabaseにGoogleが結果を返す
    //③初回→ユーザー作成、2回目→既存ユーザー取得
    //④ここのリダイレクトでアプリに戻ってくる
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',

        prompt: 'select_account',
      },
    },
  });
  console.log('after oauth call');
  if (error) {
    console.error(error);
    alert('Googleログイン失敗');
  }
};

export default signInWithGoogle;
