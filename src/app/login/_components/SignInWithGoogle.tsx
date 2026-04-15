//Google ログイン(ここでgoogle認証画面へリダイレクト)
'use client';

import { supabase } from '@/lib/supabase';

const signInWithGoogle = async () => {
  //Googleにログイン認証をお願いする仕組み
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google', //①SupabaseにGoogleログインしたいと伝える→supabaseがGoogleの認証ページに飛ばしてくれる
    //②Googleのログイン画面に飛ばされる→ユーザーがGoogleでログイン→supabaseにGoogleが結果を返す
    //③初回→ユーザー作成、2回目→既存ユーザー取得
    //④ここのリダイレクトでアプリに戻ってくる
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });

  if (error) {
    console.error(error);
    alert('Googleログイン失敗');
  }
};

export default signInWithGoogle;
