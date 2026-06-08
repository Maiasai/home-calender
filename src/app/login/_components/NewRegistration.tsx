//新規登録画面→認証は済んでいる前提で、users未登録ユーザーだけに登録処理をさせるページ

'use client';

import { supabase } from '@/lib/supabase';
import { SignupData } from '@/app/login/_typs/SignupData';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import { ModalStep } from '../_typs/ModalStep';
import { GetMeResponse } from '../../api/_types/ApiResponse';
import { NicknameData } from '../_typs/NicknameData';
import PasswordInput from './PasswordInput';
import ErrorMessage from '@/app/(main)/recipes/_components/ErrorMessage';
import { useSupabaseSession } from '@/app/(main)/home/_hooks/useSupabaseSession';
import PrimaryButton from '@/components/button/PrimaryButton';

type Props = {
  setLoginModalOpen: (v: boolean) => void;
  setStep: (v: ModalStep) => void;
  registersign: UseFormRegister<SignupData>;
  handleSubmitsign: UseFormHandleSubmit<SignupData>;
  watch: UseFormWatch<SignupData>;
  errorssign: FieldErrors<SignupData>;
  isValidsign: boolean;
  isSubmittingsign: boolean;
  isGoogleUser: boolean;
};

const NewRegistration = ({
  setLoginModalOpen,
  setStep,
  registersign,
  handleSubmitsign,
  watch,
  errorssign,
  isValidsign,
  isSubmittingsign,
  isGoogleUser,
}: Props) => {
  const { token } = useSupabaseSession();
  const router = useRouter();

  //認証済みかチェック
  useEffect(() => {
    if (!token) return;

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/');
        return;
      }

      const res = await fetch('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: GetMeResponse = await res.json();
      if (data.user) {
        const needsNickname =
          !data.user.nickname || data.user.nickname.trim() === '';

        if (needsNickname) {
          // モーダル開くフラグ or signup画面へ
          router.push('/?signup=1');
          return;
        }

        router.push('/home');
        return;
      }
    };

    checkUser();
  }, [router, token]);

  //トップに戻る押下時の処理
  const handleBackToTop = () => {
    setLoginModalOpen(false);
    setStep('select');
    router.push('/');
  };

  //登録処理
  const onSubmit = async (data: SignupData) => {
    // ① Supabaseにパスワード登録(メールアドレスから登録した場合のみ)
    if (data.password) {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        if (
          error.message.includes(
            'New password should be different from the old password',
          )
        ) {
          alert(
            '以前使用したパスワードです。別のパスワードを設定してください。',
          );
          return;
        }
        alert('パスワード設定に失敗しました');
        alert(error.message);
        return;
      }
    }

    //②プリズマにニックネームを登録
    const payload: NicknameData = {
      nickname: data.nickname,
    };

    const res = await fetch('/api/newregistration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert('登録に失敗しました');
      return;
    }

    router.push('/home');
  };

  return (
    <div>
      <form onSubmit={handleSubmitsign(onSubmit)}>
        <div className="flex items-center justify-center mb-2 text-base mt-8 font-semibold">
          <label>ニックネームを作成</label>
        </div>

        <div className="mb-4">
          <input
            type="text"
            {...registersign('nickname', {
              required: 'ニックネームは必須です',
              maxLength: {
                value: 10,
                message: '10文字以内で入力してください',
              },
            })}
            placeholder="ニックネームを入力"
            className="border p-2 px-2 py-1 w-full"
          />
          <div className="pl-2 mb-2 mt-2">
            {errorssign.nickname && (
              <ErrorMessage error={errorssign.nickname} />
            )}
          </div>
          <p className="whitespace-pre-line text-xs mb-6 pl-2">
            {`※10文字以内にする必要があります
            ※プロフィールに表示され、他のユーザーが閲覧できます。`}
          </p>
        </div>

        {/* パスワード */}
        {!isGoogleUser && (
          <div>
            <PasswordInput
              registersign={registersign}
              watch={watch}
              errorssign={errorssign}
            />
          </div>
        )}

        <div className="flex flex-col items-center justify-center">
          <p className="whitespace-pre-line text-center text-xs">
            登録することで、{''}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-700"
            >
              利用規約
            </a>
            {''}
            および{''}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-700"
            >
              プライバシーポリシー
            </a>
            {''}
            に同意したものとみなします。
          </p>
          <PrimaryButton
            type="submit"
            disabled={!isValidsign || isSubmittingsign}
            className="w-60 h-11"
            variant="primary"
          >
            {isSubmittingsign ? '登録中...' : '登録'}
          </PrimaryButton>

          <button
            type="button"
            onClick={handleBackToTop}
            className="text-xs mt-2 border-b"
          >
            トップに戻る
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRegistration;
