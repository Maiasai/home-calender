//【クライアント】レイアウト

'use client'

import Header from "../_components/Header";
import { useRouteGuard } from "./hooks/useRouteGuard";
import { useSupabaseSession } from "./hooks/useSupabaseSession";



const RootLayout = ({ children }: { children: React.ReactNode }) =>{
  useRouteGuard()
  const { session , isLoading } = useSupabaseSession()
  
  if ( isLoading ) return <p>読み込み中…</p>
  
  return(
    <div>

      <nav className="!font-hui">
        <Header />{/* Header.tsx で定義したコンポーネントを ここに表示する */}
      </nav>

      <main>
        {children}{/*ここに page.tsx の表示結果が入る */}
      </main>
    </div>

  )
}


export default RootLayout;

