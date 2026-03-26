// サーバー用クライアント（App Router対応）※Supabaseクライアント生成関数
//Supabaseクライアントに、このリクエストのCookieを使って認証してねと設定している関数

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function createSupabaseServerClient() {

  const cookieStore = await cookies()//サーバーでクッキーを取得

  //createServerClient(url, key, { cookies })=このリクエストのCookie使って認証してね
  return createServerClient(// Supabaseクライアントにクッキーを渡す
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {

        getAll() {
          return cookieStore.getAll()
        },

        setAll(cookiesToSet) {// SupabaseがCookie更新したいとき用

          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)// ブラウザに新しいCookieを書き込む
            )
          } catch {}
        },

      },
    }
  )
}