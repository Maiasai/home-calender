//退会ページ
'use client';

import { useState } from 'react';
import { useSupabaseSession } from '../../home/_hooks/useSupabaseSession';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/button/PrimaryButton';

const Withdrawal = () => {
  const { token } = useSupabaseSession();
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const handleWithdrawal = async () => {
    const ok = window.confirm(
      '退会すると、登録したレシピ・献立カレンダー・買い物リストなどのデータはすべて削除されます。\n\nこの操作は元に戻せません。\n\n本当に退会しますか？',
    );
    if (!ok) return;

    try {
      setIsDeleting(true);

      const res = await fetch('/api/mypage/withdrawal', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();

        alert(data.message ?? '退会処理に失敗しました');

        return;
      }

      alert('退会が完了しました');
      router.push('/');

      router.refresh();
    } catch (error) {
      console.log('withdrawal error', error);

      alert('退会処理中にエラーが発生しました');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex justify-center border-b-2 mb-6">退会</nav>
      <div className="rounded-lg p-2 bg-white">
        <h1 className="flex justify-center text-lg font-bold mb-4">
          退会前の確認
        </h1>

        <p className="text-xs mb-4">
          退会すると、このアカウントに紐づくデータはすべて削除されます。
        </p>

        <ul className="text-sm list-disc pl-5 mb-6 space-y-1">
          <li>登録したレシピ</li>

          <li>献立カレンダー</li>

          <li>買い物リスト</li>

          <li>お気に入り・調理済みなどの状態</li>

          <li>共有グループ情報</li>
        </ul>

        <p className="flex justify-center text-sm text-red-600 font-bold mb-6">
          この操作は元に戻せません。
        </p>
        <div className="flex justify-center ">
          <PrimaryButton
            onClick={handleWithdrawal}
            disabled={isDeleting}
            className="px-4 py-2"
            variant="danger"
          >
            {isDeleting ? '退会処理中...' : '退会する'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
