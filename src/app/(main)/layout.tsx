//【クライアント】レイアウト

'use client';

import { useRouteGuard } from './home/_hooks/useRouteGuard';
import { useSupabaseSession } from './home/_hooks/useSupabaseSession';
import Header from './Header';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSupabaseSession();

  useRouteGuard({ session, isLoading });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>読み込み中…</p>
      </div>
    );
  }
  return (
    <div className="h-dvh overflow-hidden flex flex-col">
      <nav className="!font-hui shrink-0">
        <Header />
        {/* Header.tsx で定義したコンポーネントを ここに表示する */}
      </nav>

      <main className="flex-1 min-h-0 overflow-hidden">
        {children}
        {/*ここに page.tsx の表示結果が入る */}
      </main>
    </div>
  );
};

export default RootLayout;
