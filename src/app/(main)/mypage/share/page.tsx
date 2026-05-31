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
import ErrorMessage from '../../recipes/_components/ErrorMessage';
import { EmailInviteType } from './_type/EmailInviteType';
import { useSupabaseSession } from '../../home/_hooks/useSupabaseSession';
import { useUserProfile } from '../../home/_hooks/useUserProfile';
import { OwnerType } from '@/app/api/family/me/_type/OwnerType';
import { InvitesType } from '@/app/api/family/_typs/InvitesType';
import { MembersTyps } from '@/app/api/family/_typs/MembersTyps';

const Share = () => {
  const { token } = useSupabaseSession();
  const { profile } = useUserProfile(); //ユーザー情報取得

  //トグルスイッチ
  const [syncEnabled, setSyncEnabled] = useState(false);

  const {
    data: owner,
    error: ownerError,
    mutate: mutateowner,
  } = useSWR<OwnerType>('/api/family/me', fetcher); //グループのオーナー　取得

  const {
    data: invites,
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
    control,
    name: 'invites',
  });

  const {
    data: members,
    error: membersError,
    mutate: mutateMembers,
  } = useSWR<MembersTyps[]>('/api/family/members', fetcher); //参加済みメンバー　取得

  const pendingInvites = invites?.filter((i) => i.status === 'PENDING') ?? [];

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
        const text = await res.text();
        throw new Error(`HTTP ${res.status}-${text}`);
      }

      await mutateInvites();
      alert('招待通知を送信しました。\n相手の方は通知一覧から参加できます。');
    } catch (err: any) {
      console.error(err.message);
      alert('招待メールの送信に失敗しました');
    }
  };
  //オーナー判定用
  const isOwner = owner && profile ? owner?.id === profile?.id : false;
  //参加側ユーザー判定用
  const isGuest = profile?.homeFamilyId !== profile?.activeFamilyId;

  //参加中メンバー退会 fetch
  const handleDelete = async (id: string) => {
    const ok = window.confirm(
      '共有から抜けますか？\n共有中のレシピ・献立・買い物リストは表示されなくなります。',
    );

    if (!ok) return;
    try {
      const res = await fetch('/api/family/members/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: id,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  //招待欄追加
  const MAX_FIELDS = 5;
  const handleAdd = () => {
    if (fields.length >= MAX_FIELDS) return;
    append({ email: '' });
  };

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
    mutateowner();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex justify-center border-b-2 max mb-10 mx-1">
        アプリの共有設定
      </nav>

      {/* グループオーナー表示 */}
      {isOwner && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full px-1">
            <div className="flex flex-col">
              {/* トグルスイッチ */}
              <div className="flex items-center mb-6 w-full">
                <span className="mr-3 text-base text-gray-600">
                  同期 {syncEnabled ? 'をOFFにする' : 'をONにする'}
                </span>

                <button
                  type="button"
                  onClick={onSync}
                  className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-colors ${syncEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${syncEnabled ? 'translate-x-6' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              {/* 招待エリア */}
              {syncEnabled ? (
                <>
                  <div className="mb-14">
                    <p className="mb-4">◼︎招待するメンバー</p>
                    <div className="flex flex-col">
                      {fields.map((field, index) => (
                        <div key={field.id}>
                          <div className="flex">
                            <input
                              type="email"
                              {...register(`invites.${index}.email`, {
                                //ここがinputの値管理とバリデーションを担当
                                required: 'メールアドレスは必須です',
                                pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message:
                                    '正しいメールアドレスを入力してください',
                                },
                                validate: (value, formValues) => {
                                  const emails = formValues.invites.map(
                                    (v) => v.email,
                                  );
                                  return (
                                    emails.filter((e) => e === value).length ===
                                      1 ||
                                    '同じメールアドレスが既に入力されています'
                                  );
                                },
                              })}
                              placeholder="exsample@email.com"
                              className="w-full  max-w-[300px] border px-2 py-1 rounded  ml-1"
                            ></input>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="ml-2 px-2 text-gray-500"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          <div className="ml-2">
                            <ErrorMessage
                              error={errors.invites?.[index]?.email}
                            />
                          </div>
                        </div>
                      ))}
                      {fields.length < MAX_FIELDS && (
                        <button
                          type="button"
                          onClick={handleAdd}
                          className="w-[80px] h-[30px] rounded-lg bg-orange-500 text-white text-sm font-semibold shadow-md transition-all duration-150 hover:bg-orange-600 active:scale-95 active:shadow-sm mb-2"
                        >
                          追加
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className={`w-[150px] h-[30px] rounded-lg bg-orange-500 text-white font-medium shadow-md transition-all duration-150 active:scale-95 active:translate-y-[1px] ${!isValid || isSubmitting ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-orange-600'}`}
                    >
                      一括招待ボタン
                    </button>
                  </div>
                  {/* 招待中メンバー */}
                  <div className="flex flex-col mb-8">
                    <p className="mb-3">◼︎招待中メンバー</p>
                    {pendingInvites.length === 0 ? (
                      <p className="ml-2 text-base sm:whitespace-normal whitespace-pre-line text-gray-500">
                        {`招待中メンバーは
                    いません`}
                      </p>
                    ) : (
                      pendingInvites.map((i: InvitesType) => (
                        <div key={i.id}>
                          <p className="ml-2 text-base text-gray-500">
                            {i.email}
                          </p>
                          <button>[ キャンセル ]</button>
                        </div>
                      ))
                    )}
                  </div>
                  {/* 参加済みメンバー */}
                  <div className="flex flex-col mb-4">
                    <p className="mb-3">◼︎参加済みメンバー</p>
                    {members?.length === 0 ? (
                      <p className="ml-2 text-base text-gray-500">
                        参加済みメンバーはいません
                      </p>
                    ) : (
                      members?.map((m: MembersTyps) => {
                        const isSelf = m.userId === profile?.id;
                        const isOwnerUser = m.userId === owner?.id;
                        const canDelete = isOwner && !isSelf;

                        return (
                          <div key={m.id} className="flex items-center">
                            <p className="ml-2 text-base text-gray-500">
                              {m.nickname}
                            </p>

                            {isSelf && (
                              <p className="ml-2 text-sm">（あなた）</p>
                            )}

                            {isOwnerUser && (
                              <p className="text-sm  text-orange-500">
                                ※オーナー
                              </p>
                            )}

                            {canDelete && (
                              <button
                                type="button"
                                className="ml-6 px-2 text-gray-500"
                                onClick={() => handleDelete(m.id)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              ) : (
                <div className="text-sm sm:whitespace-normal whitespace-pre-line text-gray-600 mb-14">
                  {`※ 同期すると、
                  レシピ・献立・買い物リストが
                  指定した相手と共有されます`}
                </div>
              )}
            </div>
          </div>
        </form>
      )}

      {/* グループ参加側表示 */}
      {isGuest && (
        <div className="flex items-center max-w-md mx-auto p-1">
          <div className="flex flex-col justify-center p-1">
            <p className="mb-8">
              現在「{owner?.nickname}さんのグループ」に参加しています
            </p>
            <button>共有から抜ける</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Share;
