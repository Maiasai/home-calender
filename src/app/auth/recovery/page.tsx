'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const RecoveryPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRecovery = async () => {
      const url = new URL(window.location.href);

      const code = url.searchParams.get('code');

      console.log('recovery href:', window.location.href);
      console.log('recovery search:', window.location.search);
      console.log('recovery hash:', window.location.hash);
      console.log('recovery code:', code);

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('Recovery exchange error:', error);
          alert(
            '認証情報が確認できませんでした。\nもう一度パスワード再設定メールを送信してください。',
          );
          router.replace('/');
          return;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log('recovery session:', session);

      router.replace('/?reset=1');
    };

    handleRecovery();
  }, [router]);

  return <div>パスワード再設定画面を開いています...</div>;
};

export default RecoveryPage;
