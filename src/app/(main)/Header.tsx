//ヘッダー
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useUserProfile } from './home/_hooks/useUserProfile';
import { Setting } from './Setting';
import useSWR from 'swr';
import { fetcher } from '@/lib/featcher';

import { NotificationsResponse } from './notifications/page';
import { useFamilyChangeWatcher } from './_hoocks/useFamilyChangeWatcher';

const Header = () => {
  const [open, setOpen] = useState(false); //ハンバーガーメニュー用
  useFamilyChangeWatcher();
  const { data } = useSWR<NotificationsResponse>('/api/notifications', fetcher);

  const hasUnreadNonfications = data?.hasUnread; //未読判定用

  const router = useRouter();

  const { profile } = useUserProfile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('familyWatcherUserId');
    sessionStorage.removeItem('activeFamilyId');
    router.replace('/');
  };

  return (
    <nav className="site-header md:mt-20 w-full">
      <div className="flex justify-center flex-col w-full max-w-[900px] mx-auto  mb-4 md:mb-8">
        <div className="flex">
          {profile && (
            <div className="flex justify-end w-full">
              <div className="items-center space-x-10 mr-8 mb-4  hidden md:flex">
                {/* Reactはデータが揃ってなくても描画してしまうため、データがあるときだけ描画する(クラッシュ対策）*/}
                {profile && <span>{profile.nickname} さんログイン中</span>}
                <button onClick={handleLogout}>ログアウト</button>

                <Link
                  href="/notifications"
                  className="relative inline-block ml-8"
                >
                  <Image
                    src="/images/bell.png"
                    alt="通知アイコン"
                    width={30}
                    height={20}
                  />
                  {hasUnreadNonfications && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="relative  flex pt-2 pl-4 md:justify-center w-full shrink-0">
          <Setting open={open} setOpen={setOpen} handleLogout={handleLogout} />

          <Link href="/home">
            <Image
              src="/images/rogo.png"
              alt="サイトのロゴ"
              width={233}
              height={51}
              className="min-w-[233px] min-h-[51px] "
            />
          </Link>

          {/* スマホ用通知アイコン */}
          <div className="flex absolute top-5 right-12 z-0 md:hidden">
            <Link href="/notifications" className="relative block">
              <Image
                src="/images/bell.png"
                alt="通知アイコン"
                width={30}
                height={30}
                className="w-[26px] h-[26px] min-w-[26px] min-h-[26px]"
              />
              {hasUnreadNonfications && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </Link>
          </div>

          {/* 設定アイコン */}
          <div className="flex absolute top-5 right-2 z-20 md:hidden">
            <button onClick={() => setOpen(!open)} className="relative block">
              <Image
                src="/images/settings_24.png"
                alt="設定アイコン"
                width={30}
                height={30}
                className="w-[26px] h-[26px] min-w-[26px] min-h-[26px]"
              />
            </button>
          </div>

          {/* PC表示 */}
          <div className="pt-4 ml-10 space-x-10 hidden md:block">
            <Link href="/home">献立</Link>
            <Link href="/recipes">レシピ</Link>
            <Link href="/list">買い物リスト</Link>
            <Link href="/mypage">マイページ</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
