//マイページ＞メールアドレスの変更

'use client';
import ErrorMessage from '../../recipes/_components/ErrorMessage';
import { EmailUpdateType } from './_type/EmailUpdateType ';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { UserResponseType } from '@/app/api/mypage/_typs/UserResponseType';
import { fetcher } from '@/lib/featcher';
import { supabase } from '@/lib/supabase';
import PrimaryButton from '@/components/button/PrimaryButton';
import { Loading } from '@/components/Loading';
import { Empty } from '@/components/Empty';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const EmailChange = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EmailUpdateType>({
    mode: 'onChange',
  });

  const { data, error, isLoading, mutate } = useSWR<UserResponseType>(
    `/api/mypage/`,
    fetcher,
  );

  //Emailマスク表示
  const maskEmail = (mail: string) => {
    const [name, domain] = mail.split('@');
    return `${name.slice(0, 2)}***@${domain}`;
  };

  //入力されたメールアドレスに確認メールを送信
  const onSubmit = async (data: EmailUpdateType) => {
    const next = encodeURIComponent('/mypage/email?emailChanged=true');

    const { error } = await supabase.auth.updateUser(
      {
        email: data.email,
      },

      {
        //確認メールのリンクを押した後、どこへ戻すかを指定
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=${next}`,
      },
    );

    if (error) {
      if (
        error.message ===
        'A user with this email address has already been registered'
      ) {
        setError('email', {
          type: 'manual',

          message: 'このメールアドレスは既に登録されています',
        });

        return;
      }

      setError('email', {
        type: 'manual',

        message: 'メール送信に失敗しました',
      });

      return;
    }
    alert(
      '変更前と変更後のメールアドレスに確認メールを送信しました。\n両方のメールに記載されたリンクを押すと変更が完了します。',
    );
  };

  useEffect(() => {
    if (searchParams.get('emailChanged') !== 'true') return;

    const complete = async () => {
      await mutate();

      alert('メールアドレスの変更が完了しました');

      router.replace('/mypage/email');
    };

    complete();
  }, [searchParams, router]);

  if (isLoading) return <Loading />;
  if (!data) return <Empty />;
  if (error) return <ErrorMessage />;

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
                className="w-full  max-w-[400px] border px-2 py-1 rounded  ml-1 placeholder:text-sm"
              />
              <div className="ml-2">
                <ErrorMessage error={errors.email} />
              </div>

              <p className="flex  text-xs sm:text-sm text-gray-400 mb-10 ml-3">
                ※ 受信可能なメールアドレスを入力してください。
              </p>

              <div className="flex justify-center">
                <PrimaryButton
                  type="submit" //このボタンが押されたらフォームを送信する
                  //|| → どちらかが true ならボタンは disabled
                  disabled={!isValid || isSubmitting} // バリデーションエラーあり or 送信中なら押せない
                  className="w-[100px] h-[30px]"
                  variant="primary"
                >
                  更新
                </PrimaryButton>
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
