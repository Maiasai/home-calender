//API用認証チェック関数
//前提；ユーザーがログインするとブラウザのCookieにaccess_token（JWT）が保存される

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { User } from '@supabase/supabase-js';

const requireUser = async (): Promise<User> => {
  //ここで必ずUserを返すと宣言
  const supabase = await createSupabaseServerClient(); //①リクエストのCookieをSupabaseクライアントに渡してる

  //②リクエストにくっついてきた「トークン」からユーザーを特定
  //ここで返ってくるもの　useraData.user→ログインユーザー　userError→Supabase側のエラー
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error('Unauthorized');
  }
  return data.user; //ユーザー情報がオブジェクトとしてかえる
};

export default requireUser;
