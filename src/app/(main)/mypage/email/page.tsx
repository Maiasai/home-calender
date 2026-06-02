//マイページ＞メールアドレスの変更

'use client';
import React, { useEffect } from 'react';
import ErrorMessage from '../../recipes/_components/ErrorMessage';
import { EmailUpdateType } from './_type/EmailUpdateType ';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { UserResponseType } from '@/app/api/mypage/_typs/UserResponseType';
import { fetcher } from '@/lib/featcher';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { useSupabaseSession } from '../../home/_hooks/useSupabaseSession';

const EmailChange = () => {
  const { token } = useSupabaseSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EmailUpdateType>({
    mode: 'onChange',
  });

  const searchParams = useSearchParams();
  const { data, error } = useSWR<UserResponseType>(`/api/mypage/`, fetcher);

  //Emailマスク表示
  const maskEmail = (mail: string) => {
    const [name, domain] = mail.split('@');
    return `${name.slice(0, 2)}***@${domain}`;
  };

  //入力されたメールアドレスに確認メールを送信
  const onSubmit = async (data: EmailUpdateType) => {
    const { error } = await supabase.auth.updateUser(
      {
        email: data.email,
      },

      {
        //確認メールのリンクを押した後、どこへ戻すかを指定
        emailRedirectTo: 'http://localhost:3000/mypage/email?emailChanged=true',
      },
    );

    if (error) {
      alert('メール送信に失敗しました。');
      return;
    }
    alert('確認メールを送信しました');
  };
  //メールからリンク押下後
  useEffect(() => {
    const syncEmail = async () => {
      //ここでURLに emailChanged=true があることを検知
      const emailChanged = searchParams.get('emailChanged');

      if (emailChanged === 'true') {
        const {
          data: { user },
          //getUserでSupabase Auth 側の最新emailを取得
        } = await supabase.auth.getUser();

        const authEmail = user?.email;

        if (!authEmail) return;

        //Prisma(DB)へ同期
        await fetch('/api/sync-email', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: authEmail,
          }),
        });

        alert('メールアドレスを変更しました');

        window.history.replaceState({}, '', '/mypage/email');
      }
    };
    syncEmail();
  }, [searchParams]);

  if (!data) return <div>loading...</div>;
  if (error) return <div>エラーが発生しました</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex justify-center border-b-2 mb-10">
        メールアドレスの変更
      </nav>
      {data.authProvider === 'EMAIL' ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center max-w-md mx-auto p-1">
            <div className="flex flex-col p-1">
              <div className="flex flex-col justify-center mb-6">
                <p className="flex justify-center sm:whitespace-normal whitespace-pre-line text-sm md:text-base">
                  {`現在登録されている
                メールアドレス`}
                </p>

                <p className="flex justify-center text-sm md:text-base ml-1">
                  {maskEmail(data.email)}
                </p>
              </div>

              <div className="text-sm md:text-base mb-1">
                新しいメールアドレス
              </div>
              <input
                type="email"
                {...register('email', {
                  //ここがinputの値管理とバリデーションを担当
                  required: 'メールアドレスは必須です',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '正しいメールアドレスを入力してください',
                  },
                })}
                placeholder="exsample@email.com"
                className="w-full  max-w-[400px] border px-2 py-1 rounded  ml-1"
              />
              <div className="ml-2">
                <ErrorMessage error={errors.email} />
              </div>

              <p className="flex  text-xs sm:text-sm text-gray-400 mb-10 ml-3">
                ※ 受信可能なメールアドレスを入力してください。
              </p>

              <div className="flex justify-center">
                <button
                  type="submit" //このボタンが押されたらフォームを送信する
                  //|| → どちらかが true ならボタンは disabled
                  disabled={!isValid || isSubmitting} // バリデーションエラーあり or 送信中なら押せない
                  className={`w-[100px] h-[30px] rounded-lg bg-orange-500 text-white font-medium shadow-md transition-all duration-150 active:scale-95 active:translate-y-[1px] ${!isValid || isSubmitting ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-orange-600'}`} //バリデーションエラーあり OR 送信中ならグレーアウト
                >
                  更新
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex justify-center text-sm whitespace-pre-line text-gray-500 p-6">
          {`Googleアカウントでログイン中のため、 
          メールアドレスは変更できません。`}
        </div>
      )}
    </div>
  );
};

export default EmailChange;
