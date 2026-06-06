//通知リスト
'use client';

import { fetcher } from '@/lib/featcher';
import useSWR from 'swr';
import { useSupabaseSession } from '../home/_hooks/useSupabaseSession';
import { InviteNotificationsType } from './_typs/InviteNotificationsType';
import { DeleteInviteRequest } from '@/app/api/family/invite/_type/DeleteInviteRequest';
import PrimaryButton from '@/components/button/PrimaryButton';
import { NotificationsType } from './_typs/NotificationsType';
import { useState } from 'react';
import { Loading } from '@/components/Loading';
import { Empty } from '@/components/Empty';
import { ErrorMessage } from '@/components/ErrorMessage';

//返ってくる通知の型をオブジェクトに
export type NotificationsResponse = {
  invites: InviteNotificationsType[];
  notifications: NotificationsType[];
  hasUnread: boolean;
};

const typesName = {
  RECIPE_CREATED: 'レシピを登録',
  RECIPE_UPDATED: 'レシピを更新',

  MENU_CREATED: '献立を作成',

  SHOPPING_CREATED: '買い物リストを作成',
  SHOPPING_UPDATED: '買い物リストを更新',
};

const Notifications = () => {
  const { token } = useSupabaseSession();
  const { data, isLoading, error, mutate } = useSWR<NotificationsResponse>(
    '/api/notifications',
    fetcher,
  );

  const [visibleCount, setVisibleCount] = useState(10); //表示件数管理用

  const invites = data?.invites ?? [];
  const notifications = data?.notifications ?? [];

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

  if (isLoading) return <Loading />;
  if (!data) return <Empty />;
  if (error) return <ErrorMessage />;

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

              {notifications
                .slice(0, visibleCount)
                .map((n: NotificationsType) => {
                  const date = new Date(n.createdAt);
                  const displayDate = date.toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={n.id}
                      className="border rounded-lg p-4 shadow-sm bg-white"
                    >
                      <div className="relative">
                        <p className="ml-6">{displayDate}</p>
                        <p className="flex items-center font-semibold ml-8">
                          {n.nickname}さんが{typesName[n.type]}しました
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {notifications.length > visibleCount && (
            <button onClick={() => setVisibleCount((prev) => prev + 10)}>
              もっと見る
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
