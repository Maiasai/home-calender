'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const RecoveryPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRecovery = async () => {
      const url = new URL(window.location.href);
      const hash = decodeURIComponent(window.location.hash).replaceAll(
        '+',
        ' ',
      );

      const code = url.searchParams.get('code');
      const errorCode = url.searchParams.get('error_code');

      if (
        errorCode === 'otp_expired' ||
        hash.includes('otp_expired') ||
        hash.includes('Email link is invalid or has expired')
      ) {
        alert(
          'この再設定リンクは期限切れ、またはすでに使用済みです。\nもう一度パスワード再設定メールを送信してください。',
        );
        router.replace('/');
        return;
      }

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

      if (!session) {
        alert(
          '認証情報が確認できませんでした。\nメールアプリ内ブラウザではなく、SafariやChromeで最新の再設定リンクを1回だけ開いてください。',
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
