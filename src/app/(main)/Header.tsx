//ヘッダー
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useUserProfile } from './home/_hooks/useUserProfile';
import { Hamburger } from './hamburger';

const Header = () => {
  const [open, setOpen] = useState(false); //ハンバーガーメニュー用

  const router = useRouter();

  const { profile } = useUserProfile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  return (
    <nav className="site-header md:mt-20 w-full">
      <div className="flex justify-center flex-col w-full max-w-[900px] mx-auto  mb-8">
        {profile && (
          <div className="flex justify-end w-full">
            <div className="items-center space-x-10 mr-8 mb-4  hidden md:block">
              {/* Reactはデータが揃ってなくても描画してしまうため、データがあるときだけ描画する(クラッシュ対策）*/}
              {profile && <span>{profile.nickname} さんログイン中</span>}
              <button onClick={handleLogout}>ログアウト</button>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 pl-4 md:justify-center w-full shrink-0">
          <Link href="/home">
            <Image
              src="/images/rogo.png"
              alt="サイトのロゴ"
              width={233}
              height={51}
            />
          </Link>

          <Hamburger
            open={open}
            setOpen={setOpen}
            handleLogout={handleLogout}
          />

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
