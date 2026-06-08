//参加中グループのオーナーが退会した時の処理
//Header表示中→30秒ごとに /api/users/me 確認→activeFamilyIdが変わっていたらalert→画面更新
'use client';

import { GetMeResponse } from '@/app/api/_types/ApiResponse';
import { fetcher } from '@/lib/featcher';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';

export const useFamilyChangeWatcher = () => {
  const router = useRouter();

  const { data: meData } = useSWR<GetMeResponse>('/api/users/me', fetcher, {
    refreshInterval: 30000,
  });

  useEffect(() => {
    const user = meData?.user;

    if (!user?.id || !user?.activeFamilyId || !user?.homeFamilyId) return;
    const userIdKey = 'familyWatcherUserId';

    const activeFamilyIdKey = 'activeFamilyId';

    //前回の状態
    const beforeUserId = sessionStorage.getItem(userIdKey);

    const beforeActiveFamilyId = sessionStorage.getItem(activeFamilyIdKey);

    //今の状態
    const currentUserId = user.id;

    const currentActiveFamilyId = user.activeFamilyId;

    // 別ユーザーでログインした場合は比較しない
    //初回ログイン→beforeUserIはないのでcurrentUserIdだけ保存
    if (beforeUserId !== currentUserId) {
      sessionStorage.setItem(userIdKey, currentUserId);

      sessionStorage.setItem(activeFamilyIdKey, currentActiveFamilyId);

      return;
    }

    // Familyが変わったかつ自分のFamilyに戻った時にアラートが出る
    const isFamilyChanged =
      beforeActiveFamilyId && beforeActiveFamilyId !== currentActiveFamilyId;

    const isReturnedToOwnFamily = currentActiveFamilyId === user.homeFamilyId;
    if (isFamilyChanged && isReturnedToOwnFamily) {
      alert('共有グループが解除されました。自分のグループに戻りました。');
      router.refresh();
    }
    //今回の状態を次回の「前回」にするための処理。
    sessionStorage.setItem(activeFamilyIdKey, currentActiveFamilyId);
  }, [meData, router]);
};
