'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  //メニュー項目
  const accountMenuItems = [
    { name: 'ニックネームの変更', href: '/mypage/nickname' },
    { name: 'ログイン方法の確認', href: '/mypage/login-method' },
    { name: 'メールアドレスの変更', href: '/mypage/email' },
    { name: 'パスワードの変更', href: '/mypage/password' },
  ];

  const shareMenuItems = [{ name: 'アプリの共有設定', href: '/mypage/share' }];

  return (
    <div className="max-w-[700px] mx-auto flex mt-10 gap-6">
      {/* 左側：サイドメニュー */}

      <aside className="w-full md:w-56 shrink-0">
        <nav className="bg-white rounded-xl shadow-sm p-4">
          {/* アカウント */}
          <h2 className="font-bold text-lg mb-4 border-b pb-1 ml-2">
            アカウント
          </h2>

          <div className="flex flex-col gap-1">
            {accountMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`p-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-orange-100 text-gray-400 font-bold' // 現在のページ
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-sm">{item.name}</span>
                <span>　›</span>
              </Link>
            ))}
          </div>

          {/* 共有設定 */}
          <h2 className="font-bold text-lg mb-4 border-b pb-1 ml-2 mt-8">
            共有設定
          </h2>

          <div className="flex flex-col gap-1">
            {shareMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`p-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-orange-100 text-gray-400 font-bold' // 現在のページ
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-sm">{item.name}</span>
                <span>　›</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* 右側：メインコンテンツ */}
      <main className="flex-1 bg-white p-6 rounded-xl shadow-smr">
        {children}
      </main>
    </div>
  );
};

export default MyPageLayout;
