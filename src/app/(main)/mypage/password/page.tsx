//マイページ＞パスワードの変更

'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import ErrorMessage from '../../recipes/_components/ErrorMessage';
import { supabase } from '@/lib/supabase';
import { UserResponseType } from '@/app/api/mypage/_typs/UserResponseType';
import useSWR from 'swr';
import { fetcher } from '@/lib/featcher';

const ChangePassword = () => {
  //パスワード入力欄を 表示/非表示 にする boolean
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PasswordUpdateType>({
    mode: 'onChange',
  });

  const { data, error } = useSWR<UserResponseType>(`/api/mypage/`, fetcher);

  //newPassword入力欄の最新値を常に取得→ここで比較用。validate: (value) => value === newPassword
  const password = watch('newPassword'); // newPassword の値を常に取得

  const handleResetPassword: SubmitHandler<PasswordUpdateType> = async (
    data,
  ) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    if (!currentPassword || !newPassword || !confirmPassword) {
      //これを入れることでこの先の password は string 確定とする
      alert('パスワードを入力してください');
      return;
    }

    //新しいパスワード確認
    if (newPassword !== confirmPassword) {
      alert('新しいパスワードが一致しません');
      return;
    }

    //現在のパスワードチェックのためログインユーザーをここで取得
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return;

    // 現在のパスワード確認
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email, // ログイン中ユーザーのemail
      password: currentPassword,
    });

    if (signInError) {
      alert('現在のパスワードが正しくありません');

      return;
    }

    //パスワード更新
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      console.error(updateError);

      if (
        updateError.message.includes(
          'New password should be different from the old password.',
        )
      ) {
        // 特定エラー
        alert('現在と同じパスワードは設定できません');
        return;
      }
      // それ以外の全エラー
      alert('パスワードの更新に失敗しました');
      return;
    }

    alert('パスワードを更新しました');
  };

  if (!data) return <div>loading...</div>;
  if (error) return <div>エラーが発生しました</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex justify-center border-b-2 mb-10">
        パスワードの変更
      </nav>

      {data.authProvider === 'EMAIL' ? (
        <form onSubmit={handleSubmit(handleResetPassword)}>
          <div className="flex flex-col max-w-md mx-auto mb-6">
            <div className="relative w-full max-w-[400px]">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('currentPassword', {
                  required: 'パスワードは必須です',
                  minLength: {
                    value: 6,
                    message: '6文字以上で入力してください',
                  },
                  maxLength: {
                    value: 12,
                    message: '12文字以内で入力してください',
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                    message: '英字と数字を含めてください',
                  },
                })}
                placeholder="現在のパスワードを入力"
                className="w-full border px-2 py-1 pr-10 rounded"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)} //prev（今の状態）→!prev（反対の状態）＝今の状態を反対の状態にする
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Image
                  src={
                    showPassword
                      ? '/images/eye-solid-full.svg'
                      : '/images/eye-slash-solid-full.svg'
                  }
                  alt={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                  width={22}
                  height={22}
                />
              </button>
            </div>
            <div className="pl-2 mb-1 mt-2">
              {errors.currentPassword && (
                <ErrorMessage error={errors.currentPassword} />
              )}
            </div>
          </div>

          <div className="flex flex-col max-w-md mx-auto mb-6">
            <div className="relative w-full max-w-[400px]">
              <input
                //パスワード表示切り替えの実装（ここでpsswordにするとHTMLが自動で⚫︎⚫︎⚫︎⚫︎表示にしてくれる）
                type={showNewPassword ? 'text' : 'password'}
                {...register('newPassword', {
                  required: '新しいパスワードは必須です',
                  minLength: {
                    value: 6,
                    message: '6文字以上で入力してください',
                  },
                  maxLength: {
                    value: 12,
                    message: '12文字以内で入力してください',
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                    message: '英字と数字を含めてください',
                  },
                })}
                placeholder="新しいパスワードを入力"
                className="w-full border px-2 py-1 pr-10 rounded"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)} //prev（今の状態）→!prev（反対の状態）＝今の状態を反対の状態にする
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Image
                  src={
                    showPassword
                      ? '/images/eye-solid-full.svg'
                      : '/images/eye-slash-solid-full.svg'
                  }
                  alt={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                  width={22}
                  height={22}
                />
              </button>
            </div>
            <div className="pl-2 mb-1 mt-2">
              {errors.newPassword && (
                <ErrorMessage error={errors.newPassword} />
              )}
            </div>
            <p className="whitespace-pre-line text-xs pl-2">
              {`※8文字以上にする必要があります`}
            </p>
          </div>

          <div className="flex flex-col max-w-md mx-auto mb-10">
            <div className="relative w-full max-w-[400px]">
              <input
                type={showConfirm ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: '確認用パスワードは必須です',
                  validate: (value) =>
                    value === password || 'パスワードが一致しません',
                })}
                placeholder="新しいパスワードを入力（確認）"
                className="w-full border px-2 py-1 pr-10 rounded"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)} //prev（今の状態）→!prev（反対の状態）＝今の状態を反対の状態にする
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Image
                  src={
                    showConfirm
                      ? '/images/eye-solid-full.svg'
                      : '/images/eye-slash-solid-full.svg'
                  }
                  alt={showConfirm ? 'パスワードを隠す' : 'パスワードを表示'}
                  width={22}
                  height={22}
                />
              </button>
            </div>
            <div className="pl-2 mb-1 mt-2">
              {errors.confirmPassword && (
                <ErrorMessage error={errors.confirmPassword} />
              )}
            </div>
            <p className="whitespace-pre-line text-xs mb-2 pl-2">
              {`※8文字以上にする必要があります`}
            </p>
          </div>

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
        </form>
      ) : (
        <div className="flex justify-center text-sm whitespace-pre-line text-gray-500 p-6">
          {`Googleアカウントでログイン中のため、 
                パスワードは変更できません。`}
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
