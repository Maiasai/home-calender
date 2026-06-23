//未ログイン時の画面遷移制御（副作用のコンポーネント）
//useSupabaseSession が「ログイン状態」を取得→ state 更新した後に、ここにいていいかをここで判断

import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
  session: Session | null | undefined;

  isLoading: boolean;
};

export const useRouteGuard = ({ session, isLoading }: Props) => {
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // sessionの取得中は何もしない

    const fetcher = () => {
      if (session === null) {
        // sessionがnull（未ログイン）だったら強制的にTOPへ
        router.replace('/');
      }
    };

    fetcher();
  }, [router, isLoading, session]);
};
