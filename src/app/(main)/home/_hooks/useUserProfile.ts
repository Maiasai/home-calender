// ログインユーザーをアプリ用に整形（認証情報（supabase→email/id) + DB情報（表示情報として使用→nickname）を合体）

import { useEffect, useState } from 'react';
import { useSupabaseSession } from './useSupabaseSession';
import { GetMeResponse } from '@/app/api/_types/ApiResponse';
import { fetcher } from '@/lib/featcher';
import { UserProfile } from '../_typs/UserProfile';

export const useUserProfile = () => {
  const { session, isLoading } = useSupabaseSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const mutateProfile = async () => {
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

  useEffect(() => {
    if (!session || isLoading) return;

    mutateProfile();
  }, [session, isLoading]);

  return { profile, mutateProfile }; //このhookを使った側がprofile.nickname を使える
};
