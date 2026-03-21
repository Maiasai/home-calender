//未ログイン時の画面遷移制御（副作用のコンポーネント）
//useSupabaseSession が「ログイン状態」を取得→ state 更新した後に、ここにいていいかをここで判断

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSupabaseSession } from './useSupabaseSession'

export const useRouteGuard = () => {
  const router = useRouter()
  const { session, isLoading } = useSupabaseSession()

  useEffect(() => {
    if (isLoading) return // sessionの取得中は何もしない

    const fetcher = async () => {
      if (session === null) { // sessionがnull（未ログイン）だったら強制的にTOPへ
        router.replace('/')
      }
    }

    fetcher()
  }, [router, isLoading, session])
}