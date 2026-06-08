// 管理者用
//ユーザー作成・削除・強い権限が必要なサーバー処理専用。
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // URLは公開してOK
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // サーバー専用キー
);
