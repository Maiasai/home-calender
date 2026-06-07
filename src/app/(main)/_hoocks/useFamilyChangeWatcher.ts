//参加中グループのオーナーが退会した時の処理
//Header表示中→30秒ごとに /api/users/me 確認→activeFamilyIdが変わっていたらalert→画面更新
'use client';

import { GetMeResponse } from '@/app/api/_types/ApiResponse';
import { fetcher } from '@/lib/featcher';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

export const useFamilyChangeWatcher = () => {
  const router = useRouter();
  const isFirstCheck = useRef(true);

  const { data: meData } = useSWR<GetMeResponse>('/api/users/me', fetcher, {
    refreshInterval: 30000,
  });

  useEffect(() => {
    const user = meData?.user;

    if (!user?.activeFamilyId || !user?.homeFamilyId) return;

    const storageKey = 'activeFamilyId';
    const beforeActiveFamilyId = sessionStorage.getItem(storageKey);
    const currentActiveFamilyId = user.activeFamilyId;

    // 初回は比較せず、今のactiveFamilyIdを保存するだけ
    if (isFirstCheck.current) {
      sessionStorage.setItem(storageKey, currentActiveFamilyId);
      isFirstCheck.current = false;
      return;
    }

    const isFamilyChanged =
      beforeActiveFamilyId && beforeActiveFamilyId !== currentActiveFamilyId;

    const isReturnedToOwnFamily = currentActiveFamilyId === user.homeFamilyId;

    if (isFamilyChanged && isReturnedToOwnFamily) {
      alert('共有グループが解除されました。自分のグループに戻りました。');
      router.refresh();
    }

    sessionStorage.setItem(storageKey, currentActiveFamilyId);
  }, [meData, router]);
};
