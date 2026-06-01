//グループオーナー表示

'use client';

import { UserProfile } from '@/app/(main)/home/_typs/UserProfile';
import { MembersTyps } from '@/app/api/family/_typs/MembersTyps';
import { DeleteInviteRequest } from '@/app/api/family/invite/_type/DeleteInviteRequest';
import { OwnerType } from '@/app/api/family/me/_type/OwnerType';
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import { EmailInviteType } from '../_type/EmailInviteType';
import ErrorMessage from '@/app/(main)/recipes/_components/ErrorMessage';
import { InvitesType } from '@/app/api/family/_typs/InvitesType';
import { KeyedMutator } from 'swr';

type Filed = {
  //useFieldArray内部で一意キーを自動付与してるから以下の型になる
  id: string;
  email: string;
}[];

type Props = {
  isOwner: boolean;
  owner?: OwnerType;
  profile: UserProfile | null;
  members?: MembersTyps[];
  invites?: InvitesType[];
  token: string | null;
  handleSubmit: UseFormHandleSubmit<EmailInviteType>;
  isValid: boolean;
  isSubmitting: boolean;
  register: UseFormRegister<EmailInviteType>;
  fields: Filed;
  append: (value: { email: string }) => void; //appendの型は「どの配列に、どんな形のデータを追加するか」を表している
  remove: (value: number) => void;
  errors: FieldErrors<EmailInviteType>;
  syncEnabled: boolean;
  onSubmit: (data: EmailInviteType) => Promise<void>;
  onCancel: (id: DeleteInviteRequest) => Promise<void>;
  onSync: () => Promise<void>;

  mutateMembers: KeyedMutator<MembersTyps[]>;
};

const GroupOwner = ({
  isOwner,
  owner,
  profile,
  members,
  invites,
  token,
  handleSubmit,
  isValid,
  isSubmitting,
  register,
  fields,
  append,
  remove,
  errors,
  syncEnabled,
  onSubmit,
  onCancel,
  onSync,
  mutateMembers,
}: Props) => {
  //招待欄追加
  const MAX_FIELDS = 5;
  const handleAdd = () => {
    if (fields.length >= MAX_FIELDS) return;
    append({ email: '' }); //invites.push({ email: "" })してるのと同じ→invites: [{ email: '' },{ email: "" }]
  };

  //参加中メンバー
  const pendingInvites = invites ?? [];

  //参加中メンバー削除処理
  const handleDelete = async (id: string) => {
    const ok = window.confirm(
      'このメンバーを共有グループから削除しますか？\n\n削除後、このメンバーは共有中のレシピ・献立・買い物リストにアクセスできなくなります。\nこの操作は取り消せません。',
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
      await mutateMembers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full px-2">
        <div className="flex flex-col">
          {/* トグルスイッチ */}
          <div className="flex items-center mb-6 w-full">
            <span className="pr-3 text-base text-gray-600">
              同期 {syncEnabled ? 'をOFFにする' : 'をONにする'}
            </span>

            <button
              type="button"
              onClick={onSync}
              className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors ${syncEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${syncEnabled ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </button>
          </div>

          {/* 招待エリア */}
          {syncEnabled ? (
            <>
              <div className="mb-14">
                <p className="mb-2">◼︎招待するメンバー</p>
                <p className="text-xs mb-4 ml-2">
                  ※新規登録済みユーザーのみ、グループへの参加が可能です
                </p>
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
                          className="w-full  max-w-[300px] border px-2 py-1 rounded  ml-1 mb-2"
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
                      <div className="ml-2 mb-2">
                        <ErrorMessage error={errors.invites?.[index]?.email} />
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
                    <div key={i.id} className="flex">
                      <p className="ml-2 text-base text-gray-500">{i.email}</p>
                      <button
                        type="button"
                        onClick={() => onCancel({ id: i.id })}
                        className="text-gray-500 ml-6"
                      >
                        ✕
                      </button>
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

                        {isSelf && <p className="ml-2 text-sm">（あなた）</p>}

                        {isOwnerUser && (
                          <p className="text-sm  text-orange-500">※オーナー</p>
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
  );
};

export default GroupOwner;
