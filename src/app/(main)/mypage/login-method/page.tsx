//マイページ＞ログイン方法の確認

'use client';
import React from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/featcher';
import { LoginMethodType } from '../email/_type/LoginMethodType';
import { Loading } from '@/components/Loading';
import { Empty } from '@/components/Empty';
import { ErrorMessage } from '@/components/ErrorMessage';

const LoginMethod = () => {
  const { data, isLoading, error } = useSWR<LoginMethodType>(
    `/api/mypage/`,
    fetcher,
  );

  //Emailマスク表示
  const maskEmail = (mail: string) => {
    const [name, domain] = mail.split('@');
    return `${name.slice(0, 2)}***@${domain}`;
  };

  if (isLoading) return <Loading />;
  if (!data) return <Empty />;
  if (error) return <ErrorMessage />;

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex justify-center border-b-2 max mb-10">
        ログイン方法の確認
      </nav>

      <div className="p-3">
        <p className="flex justify-center sm:whitespace-normal whitespace-pre-line text-sm md:text-base  mb-4">
          {`◼︎現在登録されている
          メールアドレス`}
        </p>

        {data.authProvider === 'EMAIL' ? (
          <div className="flex flex-col justify-center mb-6">
            <p className="flex justify-center text-sm md:text-base ml-1">
              {maskEmail(data.email)}
            </p>
          </div>
        ) : (
          <div className="flex flex-col justify-center mb-6">
            <p className="flex justify-center sm:whitespace-normal whitespace-pre-line text-xs md:text-sm mb-4 p-2">
              {`※このメールアドレスはGoogleアカウントの
            認証に使用されています`}
            </p>

            <p className="flex justify-center text-sm md:text-base ml-1">
              {maskEmail(data.email)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginMethod;
