//通知リスト
'use client';

import { fetcher } from '@/lib/featcher';
import useSWR from 'swr';
import { useSupabaseSession } from '../home/_hooks/useSupabaseSession';
import { NotificationsType } from './_typs/NotificationsType';
import { DeleteInviteRequest } from '@/app/api/family/invite/_type/DeleteInviteRequest';

const Notifications = () => {
  const { token } = useSupabaseSession();
  const { data, error, mutate } = useSWR<NotificationsType[]>(
    '/api/notifications',
    fetcher,
  );

  //参加処理
  const Join = async (inviteId: string) => {
    try {
      const res = await fetch('/api/family/invite/accept', {
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

  //招待辞退処理
  const onCancel = async (id: DeleteInviteRequest) => {
    if (
      !window.confirm(
        'このグループへの参加を辞退しますか？\n一度辞退すると元に戻せません。',
      )
    ) {
      return;
    }
    const res = await fetch('/api/family/invite', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(id),
    });
    if (!res.ok) {
      const text = await res.json();
      throw new Error(text.message);
    }
    await mutate();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex justify-center border-b-2 max mb-8">通知リスト</nav>

      <div className="p-2">
        {data?.length === 0 && (
          <p className="text-center text-gray-500">通知はありません</p>
        )}

        {data?.map((d: NotificationsType) => (
          <div key={d.id} className="border rounded-lg p-4 shadow-sm">
            {d.status === 'PENDING' && (
              <div>
                <p className="font-semibold mb-3">
                  {d.nickname}さんから招待が届いています
                </p>
                {/* クリックで招待レコードのIDが呼ばれる */}
                <div className="flex gap-3">
                  <button
                    onClick={() => Join(d.id)}
                    className="w-[80px] h-[25px] rounded-lg bg-orange-500 text-white text-sm font-semibold shadow-md transition-all duration-150 hover:bg-orange-600 active:scale-95 active:shadow-sm"
                  >
                    参加
                  </button>

                  <button
                    onClick={() => onCancel({ id: d.id })}
                    className="w-[80px] h-[25px] rounded-lg bg-red-500 text-white text-sm font-semibold shadow-md transition-all duration-150 hover:bg-red-600 active:scale-95 active:shadow-sm"
                  >
                    辞退
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
