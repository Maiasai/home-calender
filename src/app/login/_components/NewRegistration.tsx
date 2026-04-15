//新規登録画面→認証は済んでいる前提で、users未登録ユーザーだけに登録処理をさせるページ

'use client';

import { supabase } from '@/lib/supabase';
import { SignupData } from '@/app/login/_typs/SignupData';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

type Props = {
  setLoginModalOpen: (v: boolean) => void;
  setStep: (v: ModalStep) => void;
  registersign: UseFormRegister<SignupData>;
  handleSubmitsign: UseFormHandleSubmit<SignupData>;
  watch: UseFormWatch<SignupData>;
  errorssign: FieldErrors<SignupData>;
  isValidsign: boolean;
  isSubmittingsign: boolean;
  loading: boolean;
  setLoading: (v: boolean) => void;
  googleUserEmail?: string | null; //	? をつけると 親が渡さなくてもエラーにならない。null は supabase でユーザーがいない場合に null が入る可能性があるため
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
  loading,
  setLoading,
  googleUserEmail,
}: Props) => {
  const router = useRouter();

  const [isGoogleUser, setIsGoogleUser] = useState(false);

  // Google 連携ユーザーならパスワード欄を非表示
  useEffect(() => {
    const checkProvider = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.app_metadata.provider === 'google') {
        setIsGoogleUser(true);
      } else {
        setIsGoogleUser(false);
      }
    };

    checkProvider();
  }, []);

  //認証済みかチェック
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/');
        return;
      }

      const res = await fetch('/api/users/me');
      const data: GetMeResponse = await res.json();

      if (data.user) {
        router.push('/home');
        return;
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  //トップに戻る押下時の処理
  const handleBackToTop = () => {
    setLoginModalOpen(false);
    setStep('select');
    router.push('/');
  };

  //登録処理
  const onSubmit = async (data: SignupData) => {
    setLoading(true);

    // ① Supabaseにパスワード登録(メールアドレスから登録した場合のみ)
    if (data.password) {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        alert('パスワード設定に失敗');
        setLoading(false);
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
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      alert('登録に失敗しました');
      return;
    }

    router.push('main');
  };

  if (loading) {
    return <p className="p-6">読み込み中...</p>;
  }

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
          <div className="pl-2 mb-2">
            {errorssign.nickname && (
              <ErrorMessage error={errorssign.nickname} />
            )}
          </div>
          <p className="whitespace-pre-line text-xs mb-16 pl-2">
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
              href="/login/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-700"
            >
              利用規約
            </a>
            {''}
            および{''}
            <a
              href="/login/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-700"
            >
              プライバシーポリシー
            </a>
            {''}
            に同意したものとみなします。
          </p>
          <button
            type="submit"
            disabled={!isValidsign || isSubmittingsign}
            className={`transition${
              !isValidsign || isSubmittingsign
                ? 'opacity-50 grayscale cursor-not-allowed'
                : ''
            }`}
          >
            <Image
              src="/images/newregistrationbutton.png"
              alt="登録ボタン"
              width={200}
              height={20}
            />
          </button>

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
