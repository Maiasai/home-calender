'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const RecoveryPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRecovery = async () => {
      const url = new URL(window.location.href);

      const tokenHash = url.searchParams.get('token_hash');

      if (!tokenHash) {
        alert(
          '再設定リンクが正しくありません。\nもう一度パスワード再設定メールを送信してください。',
        );
        router.replace('/');
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'recovery',
      });

      if (error) {
        console.error('Recovery verify error:', error);
        alert(
          'この再設定リンクは期限切れ、またはすでに使用済みです。\nもう一度パスワード再設定メールを送信してください。',
        );
        router.replace('/');
        return;
      }

      router.replace('/?reset=1');
    };

    handleRecovery();
  }, [router]);

  return <div>パスワード再設定画面を開いています...</div>;
};

export default RecoveryPage;
