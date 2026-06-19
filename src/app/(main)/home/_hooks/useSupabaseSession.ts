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
      } = await supabase.auth.getSession();

      setSession(session);
    };

    fetchSession();

    const {
      data: { subscription },

      //変化が起きた時に、自動で session を更新してくれる。
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,

    isLoading: session === undefined,

    token: session?.access_token ?? null,
  };
};
