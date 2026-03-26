// ログインユーザーをアプリ用に整形（認証情報（supabase→email/id) + DB情報（表示情報として使用→nickname）を合体）

import { useEffect, useState } from 'react'
import { useSupabaseSession } from './useSupabaseSession'

type UserProfile = {
  nickname: string | null
}

export const useUserProfile = () => {
  const { session, isLoading } = useSupabaseSession()
  const [ profile, setProfile ] = useState < UserProfile | null >(null)

  useEffect(() => {
    if ( !session || isLoading) return

    const fetchProfile = async () => {
      const res = await fetch('/api/users/me')
      const data = await res.json()

      setProfile(data)// data === { nickname: 'm' }
    }

    fetchProfile()
  }, [session, isLoading])

  return { profile } //このhookを使った側がprofile.nickname を使える
}