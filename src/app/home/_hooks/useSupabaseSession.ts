//現在のログイン状態をチェックして、ヘッダーの内容の出し分け
//ログイン状態をチェックするために作成するカスタムhook

import { supabase } from '@/_libs/supabase'
import { Session } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export const useSupabaseSession = () => {
  // undefined: ログイン状態読み込み中, null: 未ログイン, Session: ログイン済み
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [token, setToken] = useState<string | null>(null)
  const pathname = usePathname()//ページが変わったことを検知するため、現在のURLを取得

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()//①ログイン実行されRootLayout が描画＞描画後、ここでログインしているか確認
      setSession(session)//取得したログイン情報をStateに保存
      setToken(session?.access_token || null)//ログイン済みならトークン保存。未ログインならnull
    }
    

    fetcher()
  }, [pathname])//ページ遷移時、リロード、URL 変更の度にsessionを再確認するためにセット

  return { 
    session, isLoading: session === undefined, token
  }
}