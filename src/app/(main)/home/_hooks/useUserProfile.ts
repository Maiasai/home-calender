// ログインユーザーをアプリ用に整形（認証情報（supabase→email/id) + DB情報（表示情報として使用→nickname）を合体）

import { useEffect, useState } from 'react';
import { useSupabaseSession } from './useSupabaseSession';
import { GetMeResponse } from '@/app/api/_types/ApiResponse';
import { fetcher } from '@/lib/featcher';

type UserProfile = {
  id: string;
  email: string;
  nickname: string | null;
  activeFamilyId: string | null;
  homeFamilyId: string | null;
};

export const useUserProfile = () => {
  const { session, isLoading } = useSupabaseSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!session || isLoading) return;

    const fetchProfile = async () => {
      const data: GetMeResponse = await fetcher('/api/users/me');

      setProfile(
        data.user
          ? {
              id: data.user.id,
              email: data.user.email,
              nickname: data.user.nickname,
              activeFamilyId: data.user.activeFamilyId,
              homeFamilyId: data.user.homeFamilyId,
            }
          : null,
      ); // data === {   nickname: "m",activeFamilyId: "aaa",homeFamilyId: "bbb" }
    };

    fetchProfile();
  }, [session, isLoading]);

  return { profile }; //このhookを使った側がprofile.nickname を使える
};
