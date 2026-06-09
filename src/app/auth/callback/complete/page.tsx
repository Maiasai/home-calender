'use client';

import { GetMeResponse } from '@/app/api/_types/ApiResponse';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AuthCompletePage = () => {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.replace('/');
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/');
        return;
      }

      const authProviders = user.app_metadata?.providers;

      const isGoogleUser =
        user.app_metadata?.provider === 'google' ||
        (Array.isArray(authProviders) && authProviders.includes('google'));

      const provider = isGoogleUser ? 'google' : 'email';

      await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          provider,
        }),
      });

      const res = await fetch('/api/users/me', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data: GetMeResponse = await res.json();

      sessionStorage.setItem(
        'authResult',
        JSON.stringify({
          provider,
          isGoogleUser,
        }),
      );

      const needsNickname =
        data.user && (!data.user.nickname || data.user.nickname.trim() === '');

      if (needsNickname) {
        router.replace('/?signup=1');
      } else {
        router.replace('/home');
      }
    };

    run();
  }, [router]);

  return (
    <p className="flex items-center justify-center min-h-screen">
      ログイン処理中...
    </p>
  );
};

export default AuthCompletePage;
