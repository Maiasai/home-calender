//ブラウザ用クライアント
//ログイン、OTP、パスワード再設定、updateUser() など、クライアント側で使う

import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      detectSessionInUrl: false,
    },
  },
);
