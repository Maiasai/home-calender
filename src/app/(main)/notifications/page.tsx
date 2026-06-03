//通知リスト
'use client';

import { fetcher } from '@/lib/featcher';
import useSWR from 'swr';
import { useSupabaseSession } from '../home/_hooks/useSupabaseSession';
import { InviteNotificationsType } from './_typs/InviteNotificationsType';
import { DeleteInviteRequest } from '@/app/api/family/invite/_type/DeleteInviteRequest';
import PrimaryButton from '@/components/button/PrimaryButton';
import { NotificationsType } from './_typs/NotificationsType';

//返ってくる通知の型をオブジェクトに
export type NotificationsResponse = {
  invites: InviteNotificationsType[];
  notifications: NotificationsType[];
};

const Notifications = () => {
  const { token } = useSupabaseSession();
  const { data, error, mutate } = useSWR<NotificationsResponse>(
    '/api/notifications',
    fetcher,
  );

  const invites = data?.invites ?? [];
  const notifications = data?.notifications ?? [];

  const hasUnreadInvite = invites.length > 0; //未読判定用
  const hasUnreadNonfications = notifications.length > 0; //未読判定用

  ////招待通知//////////////
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

      <div className="mb-10">
        <div className="bg-gray-200 p-1 rounded-lg shadow-sm">
          <div className="flex flex-col rounded-lg">
            <h1 className="flex justify-center font-bold shadow-sm bg-white rounded-lg p-1 m-2">
              招待通知
            </h1>
            <div className="p-2">
              {invites.length === 0 && (
                <p className="text-center rounded-lg p-10 shadow-sm bg-white my-2">
                  通知はありません
                </p>
              )}

              {invites.map((d: InviteNotificationsType) => (
                <div
                  key={d.id}
                  className="border rounded-lg p-4 shadow-sm bg-white"
                >
                  <div className="relative">
                    <p className="font-semibold mb-3 ml-6">
                      {d.nickname}さんから招待が届いています
                    </p>
                    {/* クリックで招待レコードのIDが呼ばれる */}
                    <div className="flex gap-3 ml-6">
                      <PrimaryButton
                        onClick={() => Join(d.id)}
                        className="w-[80px] h-[25px]"
                        variant="primary"
                      >
                        参加
                      </PrimaryButton>

                      <button
                        onClick={() => onCancel({ id: d.id })}
                        className="w-[80px] h-[25px] rounded-lg bg-red-500 text-white text-sm font-semibold shadow-md transition-all duration-150 hover:bg-red-600 active:scale-95 active:shadow-sm"
                      >
                        辞退
                      </button>
                    </div>
                    {hasUnreadInvite && (
                      <span className="absolute -top-1 --1 w-3 h-3 bg-red-500 rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-200 p-1 rounded-lg shadow-sm">
        <div className="flex flex-col rounded-lg">
          <h1 className="flex justify-center font-bold shadow-sm bg-white rounded-lg p-1 m-2">
            更新通知
          </h1>
          <div>
            <div className="p-2">
              {notifications.length === 0 && (
                <p className="text-center rounded-lg p-10 shadow-sm bg-white my-2">
                  通知はありません
                </p>
              )}
              {notifications.map((n: NotificationsType) => (
                <div
                  key={n.id}
                  className="border rounded-lg p-4 shadow-sm bg-white"
                >
                  <h1 className="font=bold">招待通知</h1>
                  <div className="relative">
                    <p className="font-semibold mb-3 ml-6">
                      {n.nickname}さんが{n.type}しました
                    </p>
                    {hasUnreadNonfications && (
                      <span className="absolute -top-1 --1 w-3 h-3 bg-red-500 rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
