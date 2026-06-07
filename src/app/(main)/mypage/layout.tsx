'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); //現在開いているURL

  //メニュー項目
  const accountMenuItems = [
    { name: 'ニックネームの変更', href: '/mypage/nickname' },
    { name: 'ログイン方法の確認', href: '/mypage/login-method' },
    { name: 'メールアドレスの変更', href: '/mypage/email' },
    { name: 'パスワードの変更', href: '/mypage/password' },
  ];

  const shareMenuItems = [{ name: 'アプリの共有設定', href: '/mypage/share' }];

  const aboutApp = [
    { name: '利用規約', href: '/terms' },
    { name: 'プライバシーポリシー', href: '/privacy' },
    { name: '退会', href: '/mypage/withdrawal' },
  ];

  return (
    <div className="flex max-w-3xl mx-auto mt-10 gap-1 sm:gap-2">
      {/* 左側：サイドメニュー */}

      <aside className="w-42 sm:w-56 shrink-0">
        <nav className="bg-white rounded-xl shadow-sm p-1 sm:p-4">
          {/* アカウント */}
          <h2 className="font-bold text-sm sm:text-lg mb-4 border-b ml-2">
            アカウント
          </h2>

          <div className="flex flex-col gap-1 ml-2">
            {accountMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`p-1 sm:p-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-orange-100 text-gray-400 font-bold' // 現在のページ
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-xs  sm:text-sm">{item.name}</span>
                <span>　›</span>
              </Link>
            ))}
          </div>

          {/* 共有設定 */}
          <h2 className="font-bold text-sm mb-4 border-b pb-1 ml-2 mt-8">
            共有設定
          </h2>

          <div className="flex flex-col gap-1 ml-2">
            {shareMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`p-1 sm:p-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-orange-100 text-gray-400 font-bold' // 現在のページ
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-xs  sm:text-sm">{item.name}</span>
                <span>　›</span>
              </Link>
            ))}
          </div>

          {/* アプリについて */}
          <h2 className="font-bold text-sm mb-4 border-b pb-1 ml-2 mt-8">
            アプリについて
          </h2>

          <div className="flex flex-col gap-1 ml-2">
            {aboutApp.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className={`p-1 sm:p-3 rounded-lg transition-colors ${
                  pathname === a.href
                    ? 'bg-orange-100 text-gray-400 font-bold'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-xs  sm:text-sm">{a.name}</span>
                <span>　›</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* 右側：メインコンテンツ */}
      <main className="flex-1 bg-white pr-1 sm:p-4 rounded-xl shadow-smr">
        {children}
      </main>
    </div>
  );
};

export default MyPageLayout;
