//【クライアント】レイアウト

'use client';

import { useRouter } from 'next/navigation'; //App Router

import { useRouteGuard } from './home/_hooks/useRouteGuard';
import { useSupabaseSession } from './home/_hooks/useSupabaseSession';
import { useEffect } from 'react';
import Header from './Header';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  useRouteGuard();
  const { session, isLoading } = useSupabaseSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      //セッションがない場合、トップ画面に遷移
      router.push('/');
    }
  }, [session, isLoading, router]);

  if (isLoading) return <p>読み込み中…</p>;

  return (
    <div>
      <nav className="!font-hui">
        <Header />
        {/* Header.tsx で定義したコンポーネントを ここに表示する */}
      </nav>

      <main>
        {children}
        {/*ここに page.tsx の表示結果が入る */}
      </main>
    </div>
  );
};

export default RootLayout;
