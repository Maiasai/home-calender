//マイページ＞ニックネームの変更

'use client';
import { UserResponseType } from '@/app/api/mypage/_typs/UserResponseType';
import { fetcher } from '@/lib/featcher';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import ErrorMessage from '../../recipes/_components/ErrorMessage';
import { NickNameType } from './_type/NickNameType';
import { useSupabaseSession } from '../../home/_hooks/useSupabaseSession';
import PrimaryButton from '@/components/button/PrimaryButton';
import { Loading } from '@/components/Loading';
import { Empty } from '@/components/Empty';

const NickName = () => {
  const { token } = useSupabaseSession();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<NickNameType>({
    mode: 'onChange',
    defaultValues: { nickname: '' }, //①初回レンダリングで空フォーム作成
  });

  //②SWRで取得
  const { data, isLoading, error } = useSWR<UserResponseType>(
    `/api/mypage/`,
    fetcher,
  );

  //③data取得できたら発動（resetがフォーム全体の値を入れ直してくれる）
  useEffect(() => {
    if (data) {
      reset({
        //reset = フォームstateを強制的に入れ替える役割

        //SWRのdataからくるnicknameにはnullが入っている.
        //useForm側はstringのみを期待しているため、ここでnullを空文字に変換して安全にuseForm側に値を渡す
        nickname: data.nickname ?? '',
      });
    }
  }, [data, reset]); //useEffect 内で使ってる値はdependencyに全部入れるルールがあるからresetも必要

  //更新処理
  const onSubmit = async (data: NickNameType) => {
    try {
      const res = await fetch('/api/mypage/nickname', {
        method: 'PUT',
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
      alert('ニックネームを更新しました');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('エラーが発生しました');
      }
    }
  };

  if (isLoading) return <Loading />;
  if (!data) return <Empty />;
  if (error) return <ErrorMessage />;

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex justify-center border-b-2 mb-10">
        ニックネームの変更
      </nav>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center max-w-md mx-auto">
          <div className="flex flex-col p-1">
            <input
              {...register('nickname', {
                required: 'ニックネームは必須です',
                maxLength: {
                  value: 10,
                  message: '10文字以内で入力してください',
                },
              })}
              placeholder="ニックネームを入力"
              className="w-full  max-w-[400px] border px-2 py-1 rounded placeholder:text-sm"
            />
            <div className="my-2 ml-2">
              <ErrorMessage error={errors.nickname} />
            </div>

            <div className="ml-3">
              <p className="flex  text-xs sm:text-sm text-gray-400 mb-1">
                ※10文字以内にする必要があります
              </p>
              <p className="flex  text-xs sm:text-sm text-gray-400 mb-10">
                ※プロフィールに表示され、他のユーザーが閲覧できます。
              </p>
            </div>

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
    </div>
  );
};

export default NickName;
