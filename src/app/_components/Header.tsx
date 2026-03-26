//ヘッダー
'use client'

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useUserProfile } from "../home/hooks/useUserProfile";
import { supabase } from "@/_libs/supabase";
import { useRouter } from "next/navigation";


const Header = () => {
  const router = useRouter()

  const { profile } = useUserProfile()


  const handleLogout = async () => {    
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <nav className="site-header mt-20 w-full">
      <div className="flex justify-center flex-col w-[900px] mx-auto">
        {profile && (
          <div className="flex justify-end w-full">

            <div className="flex items-center space-x-10">
              <span>{profile.nickname} さんログイン中 </span>

              <button
                onClick={handleLogout}
              >
                ログアウト
              </button>

            </div>
          </div>
        )}


        <div className="flex justify-center w-full">
          <Image
            src="/images/Frame324.png"
            alt="サイトのロゴ"
            width={233}
            height={51}
          />
          
          <div className="pt-4 ml-10 space-x-10">
            <Link href="/home">献立</Link>
            <Link href="/home/recipes">レシピ</Link>
            <Link href="/home/list">買い物リスト</Link>
            <Link href="/home/mypage">マイページ</Link>
          </div>

        </div>
        
      </div>
  </nav>

  )

}

export default Header;