//現在のログイン状態をチェックして、ヘッダーの内容の出し分け
//ログイン状態をチェックするために作成するカスタムhook

import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

export const useSupabaseSession = () => {
  // undefined: ログイン状態読み込み中, null: 未ログイン, Session: ログイン済み
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        //ログインするとsupabaseがブラウザ側にセッション情報を保存してくれる。ブラウザに保存されているログイン情報をgetSessionで見て、
        //ログイン中ならsession.未ログインならnullを返す
      } = await supabase.auth.getSession();
      console.log('getSession結果', session);
      setSession(session);
    };

    fetchSession();

    const {
      data: { subscription },

      //ログイン,ログアウト,トーク更新,ユーザー情報変更など。変化が起きた時に、自動で session を更新してくれる。
      //「_event」のeventは何が起きたか。「_」は使わない引数という書き方にしてる。
    } = supabase.auth.onAuthStateChange((_event, session) => {
      //onAuthStateChange は、認証状態を監視
      setSession(session);
    });

    return () => {
      subscription.unsubscribe(); //unsubscribe()は監視を解除する関数
    };
  }, []);

  return {
    session,

    isLoading: session === undefined,

    token: session?.access_token ?? null,
  };
};
