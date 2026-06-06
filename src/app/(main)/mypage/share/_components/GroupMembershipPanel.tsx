//グループ参加側表示

'use client';

import { MembersTyps } from '@/app/api/family/_typs/MembersTyps';
import { OwnerType } from '@/app/api/family/me/_type/OwnerType';
import { KeyedMutator } from 'swr';

type Props = {
  owner?: OwnerType;
  mutateMembers: KeyedMutator<MembersTyps[]>;
  mutateProfile: () => Promise<void>;
  token: string | null;
};

const GroupMembershipPanel = ({
  owner,
  mutateMembers,
  mutateProfile,
  token,
}: Props) => {
  //グループから退出
  const onExit = async () => {
    if (
      !window.confirm(
        'このグループからの退出しますか？\n一度退出すると元に戻せません。',
      )
    ) {
      return;
    }
    const res = await fetch('/api/family/members/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const text = await res.json();
      throw new Error(text.message);
    }
    await mutateMembers();
    await mutateProfile();
  };
  return (
    <div className="flex flex-col w-full">
      <p className="flex justify-center">
        現在、{owner?.nickname}さんのグループに
      </p>
      <p className="flex justify-center mb-8">参加しています</p>
      <div className="flex justify-center">
        <button
          onClick={onExit}
          className="w-[150px] h-[25px] rounded-lg bg-red-500 text-white text-sm font-semibold shadow-md transition-all duration-150 hover:bg-red-600 active:scale-95 active:shadow-sm"
        >
          グループから退出
        </button>
      </div>
      <div className="mb-8 rounded-lg bg-orange-50 px-4 py-3 text-xs text-gray-700 leading-relaxed mt-20">
        <p>※「作ったことある」は、家族みんなで確認できます。</p>

        <p>※「お気に入り」は、自分だけの設定として保存されます。</p>
      </div>
    </div>
  );
};

export default GroupMembershipPanel;
