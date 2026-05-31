//通知リスト
'use client';

import { fetcher } from '@/lib/featcher';
import useSWR from 'swr';
import { useSupabaseSession } from '../home/_hooks/useSupabaseSession';
import { NotificationsType } from './_typs/NotificationsType';

const Notifications = () => {
  const { token } = useSupabaseSession();
  const { data, error, mutate } = useSWR<NotificationsType[]>(
    '/api/notifications',
    fetcher,
  );

  const Join = async (inviteId: string) => {
    try {
      const res = await fetch('/api/mypage/family/invite/accept', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inviteId }),
      });
      if (!res.ok) {
        const text = await res.json();
        throw new Error(text.message);
      }

      await mutate();
      alert('招待への参加が完了しました');
    } catch (error: any) {
      console.error(error.message);
      alert('招待への参加が失敗しました');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex justify-center border-b-2 max mb-4">通知リスト</nav>

      {data?.length === 0 && <p className="text-center">通知はありません</p>}

      {data?.map((d: NotificationsType) => (
        <div key={d.id}>
          {d.status === 'PENDING' && (
            <div>
              <p>{d.nickname}さんから招待が来ました</p>
              {/* クリックで招待レコードのIDが呼ばれる */}
              <button onClick={() => Join(d.id)}>[参加]</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
