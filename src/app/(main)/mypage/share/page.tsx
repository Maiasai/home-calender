//マイページ＞アプリの共有設定
//区分　確定メンバー→FamilyMember  招待状態→FamilyInvite
//* owner → ファミリーのオーナー情報（API）
//* profile → ログイン中ユーザー
//* member → 参加者一覧の1行

'use client';
import { fetcher } from '@/lib/featcher';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { EmailInviteType } from './_type/EmailInviteType';
import { useSupabaseSession } from '../../home/_hooks/useSupabaseSession';
import { useUserProfile } from '../../home/_hooks/useUserProfile';
import { OwnerType } from '@/app/api/family/me/_type/OwnerType';
import { InvitesType } from '@/app/api/family/_typs/InvitesType';
import { MembersTyps } from '@/app/api/family/_typs/MembersTyps';
import GroupMembershipPanel from './_components/GroupMembershipPanel';
import GroupOwner from './_components/GroupOwner';
import { DeleteInviteRequest } from '@/app/api/family/invite/_type/DeleteInviteRequest';
import { Loading } from '@/components/Loading';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Empty } from '@/components/Empty';
import FamilyGuideModal from './_components/FamilyGuideModal';

const Share = () => {
  const { token } = useSupabaseSession();
  const { profile, mutateProfile } = useUserProfile(); //ユーザー情報取得
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  //初回説明モーダル
  useEffect(() => {
    const hideGuide = localStorage.getItem('hideFamilyGuide');

    if (hideGuide !== 'true') {
      setIsGuideOpen(true);
    }
  }, []);

  const handleCloseGuide = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideFamilyGuide', 'true');
    }

    setIsGuideOpen(false);
  };

  //トグルスイッチ
  const [syncEnabled, setSyncEnabled] = useState(false);

  const {
    data: owner,
    isLoading: ownerisLoading,
    error: ownerError,
    mutate: mutateowner,
  } = useSWR<OwnerType>('/api/family/me', fetcher); //グループのオーナー　取得

  const {
    data: invites,
    isLoading: invitesisLoading,
    error: invitesError,
    mutate: mutateInvites,
  } = useSWR<InvitesType[]>('/api/family/invites', fetcher); //招待済みメンバー　取得

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EmailInviteType>({
    mode: 'onChange',
    defaultValues: {
      invites: [{ email: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    //useFieldArray→すでにあるフォーム状態に操作APIを後付けしている,拡張レイヤー
    //↓useFormが持ってる invites という配列を、操作対象として取り出すという意味
    control, //control = フォーム全体へのアクセスキー
    name: 'invites', // name→どのフィールドを操作対象にするか指定するパス
  });

  const {
    data: members,
    isLoading: membersisLoading,
    error: membersError,
    mutate: mutateMembers,
  } = useSWR<MembersTyps[]>('/api/family/members', fetcher); //参加済みメンバー　取得

  const isLoading = ownerisLoading || invitesisLoading || membersisLoading;
  const isError = ownerError || invitesError || membersError;

  //招待送信処理
  const onSubmit = async (data: EmailInviteType) => {
    try {
      const res = await fetch('/api/family/invite', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const text = await res.json();
        throw new Error(text.message);
      }

      await mutateInvites();
      alert('招待通知を送信しました。\n相手の方は通知一覧から参加できます。');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('エラーが発生しました');
      }
    }
  };

  //招待中キャンセル処理
  const onCancel = async (id: DeleteInviteRequest) => {
    if (
      id &&
      !window.confirm(
        'このメンバーへの招待を取り消しますか？\n取り消した招待は元に戻せません。',
      )
    ) {
      return;
    }
    await fetch('/api/family/invite', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(id),
    });
    await mutateInvites();
  };

  //オーナー判定用
  const isOwner = owner && profile ? owner?.id === profile?.id : false;
  //参加側ユーザー判定用
  const isGuest = profile?.homeFamilyId !== profile?.activeFamilyId;

  //同期トグル（初期同期反映）
  useEffect(() => {
    if (!owner) return;
    setSyncEnabled(owner.syncEnabled);
  }, [owner]);

  //同期ON/OFF
  const onSync = async () => {
    const next = !syncEnabled; //ここで今のボタン状態を反転

    if (
      syncEnabled &&
      !window.confirm(
        '同期をOFFにすると参加メンバーへの共有が停止します。よろしいですか？',
      )
    ) {
      return;
    }

    await fetch('/api/family/sync', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        syncEnabled: next,
      }),
    });
    setSyncEnabled(next);
    await mutateowner();
  };

  if (isLoading) return <Loading />;
  if (!owner) return <Empty />;
  if (isError) return <ErrorMessage />;

  return (
    <div className="max-w-3xl mx-auto">
      {/* 初回モーダル表示 */}
      {isGuideOpen && (
        <FamilyGuideModal
          onClose={handleCloseGuide}
          dontShowAgain={dontShowAgain}
          setDontShowAgain={setDontShowAgain}
        />
      )}

      <nav className="flex justify-center border-b-2 mb-10 px-1">
        アプリの共有設定
      </nav>

      {/* グループオーナー表示 */}
      {isOwner && (
        <>
          <GroupOwner
            isOwner={isOwner}
            owner={owner}
            profile={profile}
            members={members}
            invites={invites}
            token={token}
            handleSubmit={handleSubmit}
            isValid={isValid}
            isSubmitting={isSubmitting}
            register={register}
            fields={fields}
            append={append}
            remove={remove}
            errors={errors}
            syncEnabled={syncEnabled}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onSync={onSync}
            mutateMembers={mutateMembers}
          />
        </>
      )}

      {/* グループ参加側表示 */}
      {isGuest && (
        <>
          <GroupMembershipPanel
            owner={owner}
            mutateMembers={mutateMembers}
            mutateProfile={mutateProfile}
            token={token}
          />
        </>
      )}
    </div>
  );
};

export default Share;
