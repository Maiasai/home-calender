//Google / OTP 共通のコールバック→認証コードを通過したユーザーがSupabaseAuth上でログイン状態になっているかを見ている

'use client'

import { useEffect } from "react"
import { supabase } from "@/_libs/supabase"
import { useRouter } from "next/navigation"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    console.log("Callback useEffect start");
    const handle = async () => {
      const { data: sessionData , error: sessionError } =
      await supabase.auth.exchangeCodeForSession(window.location.href)

      console.log("exchange:", sessionData, sessionError)



      // 今ログイン中のユーザー取得（OTP/Google共通）
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      console.log("Callback user:", user);

      //未認証（セッションなし）
      if (userError || !user) {
        router.push("/")
        return
      }

      // users テーブルに存在するかどうかを確認
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle()

      if (data && data.id) {
        // データがある→既存ユーザー→ホーム画面に飛ばす
        router.push("/home")
      } else {
        // データがない→初回ログイン（Google / OTP 共通）→サインアップ画面（ニックネームと電話番号登録）
        router.push("/signup")
      }
    }

    handle()
  }, [router])

  return <p>ログイン処理中...</p>
}