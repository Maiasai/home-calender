'use client'

import { useState } from "react";
import LoginModal from "./_components/LoginModal";


const Home = () => {
  const [LoginModalOpen,setLoginModalOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <h1>おうちごはんカレンダー</h1>

      <button //開くボタン
        onClick={()=>setLoginModalOpen(true)}>
        新規登録　または　ログイン
      </button>

      <LoginModal //モーダル箇所
        open={LoginModalOpen} //今モーダル開いているかどうかの現在の状態そのものを渡してる
        onClose={()=>setLoginModalOpen(false)}//呼ばれたらloginModalOpenをfalseにして
      />
    </div>

  )
}

export default Home;
