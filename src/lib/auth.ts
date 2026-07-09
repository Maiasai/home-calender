//API用認証チェック関数
//前提：フロント側でAuthorization headerにaccess_token(JWT)を付与して送信する

import { User } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { supabase } from './supabase';

const requireUser = async (request: NextRequest): Promise<User> => {
  const token = //Authorizarionがあるときだけreplaceしてねという意味
    request.headers.get('Authorization')?.replace('Bearer ', '') ?? ''; //①リクエスト中のBearerの中身だけを取り出す

  //②リクエストにくっついてきた「トークン」からユーザーを特定
  //ここで返ってくるもの　userData.user→ログインユーザー　userError→Supabase側のエラー
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new Error('Unauthorized');
  }
  return data.user; //ユーザー情報がオブジェクトとしてかえる
};

export default requireUser;
