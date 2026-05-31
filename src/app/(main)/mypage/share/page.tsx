//マイページ＞アプリの共有設定
//区分　確定メンバー→FamilyMember  招待状態→FamilyInvite

'use client';
import { fetcher } from '@/lib/featcher';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import useSWR from 'swr';
import ErrorMessage from '../../recipes/_components/ErrorMessage';
import { EmailInviteType } from './_type/EmailInviteType';
import { useSupabaseSession } from '../../home/_hooks/useSupabaseSession';
import { MembersTyps } from '@/app/api/mypage/family/_typs/MembersTyps';
import { InvitesType } from '@/app/api/mypage/family/_typs/InvitesType';
import { useUserProfile } from '../../home/_hooks/useUserProfile';
import { OwnerType } from '@/app/api/mypage/family/current/_type/OwnerType';

const Share = () => {
  const { token } = useSupabaseSession();
  const { profile } = useUserProfile(); //ユーザー情報取得

  const {
    data: owner,
    error: ownerError,
    mutate: mutateowner,
  } = useSWR<OwnerType>('/api/mypage/family/current', fetcher); //グループのオーナー　取得

  const {
    data: invites,
    error: invitesError,
    mutate: mutateInvites,
  } = useSWR<InvitesType[]>('/api/mypage/family/invites', fetcher); //招待済みメンバー　取得

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
  } = useSWR<MembersTyps[]>('/api/mypage/family/members', fetcher); //参加済みメンバー　取得

  const pendingInvites = invites?.filter((i) => i.status === 'PENDING') ?? [];

  const onSubmit = async (data: EmailInviteType) => {
    try {
      const res = await fetch('/api/mypage/family/invite', {
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
      alert('招待メールの送信が完了しました');
    } catch (err: any) {
      console.error(err.message);
      alert('招待メールの送信に失敗しました');
    }
  };

  //参加側ユーザー判定用
  const isGuest = profile?.homeFamilyId !== profile?.activeFamilyId;

  //参加中メンバー退会 fetch
  const handleDelete = async (id: string) => {
    const ok = window.confirm(
      '共有から抜けますか？\n共有中のレシピ・献立・買い物リストは表示されなくなります。',
    );

    if (!ok) return;
    try {
      const res = await fetch('/api/mypage/family/leave', {
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

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex justify-center border-b-2 max mb-4">
        アプリの共有設定
      </nav>

      {/* グループオーナー表示 */}
      {!isGuest && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center max-w-md mx-auto p-1">
            <div className="flex flex-col justify-center p-1">
              <p className="flex justify-center items-center mb-6">
                同期 ON / OFF（トグル）※ family共有のスイッチ
              </p>

              {/* 招待エリア */}
              <div className="mb-14">
                <p>招待するメンバー</p>
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
                              message: '正しいメールアドレスを入力してください',
                            },
                          })}
                          placeholder="exsample@email.com"
                          className="w-full  max-w-[400px] border px-2 py-1 rounded  ml-1"
                        ></input>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="ml-2 px-2 text-gray-500"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="ml-2">
                        <ErrorMessage error={errors.invites?.[index]?.email} />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => append({ email: '' })}
                    className="w-[80px] h-[30px] rounded-lg bg-orange-500 text-white text-sm font-semibold shadow-md transition-all duration-150 hover:bg-orange-600 active:scale-95 active:shadow-sm mb-4"
                  >
                    追加
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`w-[150px] h-[30px] rounded-lg bg-orange-500 text-white font-medium shadow-md transition-all duration-150 active:scale-95 active:translate-y-[1px] ${!isValid || isSubmitting ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-orange-600'}`}
                >
                  一括招待ボタン
                </button>
              </div>

              {/* 招待中 */}
              <div className="flex flex-col mb-8">
                <p className="mb-3">◼︎招待中メンバー</p>
                {pendingInvites.length === 0 ? (
                  <p className="ml-2 text-base text-gray-500">
                    招待中メンバーはいません
                  </p>
                ) : (
                  pendingInvites.map((i: InvitesType) => (
                    <div key={i.id}>
                      <p className="ml-2 text-base text-gray-500">{i.email}</p>
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
                  members?.map((m: MembersTyps) => (
                    <div key={m.id} className="flex">
                      <p className="ml-2 text-base text-gray-500">
                        {m.nickname}
                      </p>

                      <button
                        type="button"
                        className="ml-6 px-2 text-gray-500"
                        onClick={() => handleDelete(m.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
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
