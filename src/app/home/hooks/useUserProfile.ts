// ログインユーザーをアプリ用に整形（認証情報（supabase→email/id) + DB情報（表示情報として使用→nickname）を合体）

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/_libs/supabase'
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
      const { data } = await supabase //返ってきたオブジェクトのdataだけを取り出している　→　{data: { nickname: 'm' },error: null}
        .from('users')
        .select('nickname')
        .eq('id', session.user.id)
        .maybeSingle()//.maybeSingle() を置くことで「0件 or 1件」って明示できる。返りを[]じゃなく{}にできる

      setProfile(data)// data === { nickname: 'm' }
    }

    fetchProfile()
  }, [session, isLoading])

  return { profile } //このhookを使った側がprofile.nickname を使える
}