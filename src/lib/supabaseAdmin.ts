// @/_libs/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // URLは公開してOK
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // サーバー専用キー
);
