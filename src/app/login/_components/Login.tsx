//ログイン

'use client';

import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import { ModalStep } from '../_typs/ModalStep';
import { SignupData } from '@/app/login/_typs/SignupData';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import Image from 'next/image';
import { Mode } from '../_typs/Mode';
import ErrorMessage from '@/app/(main)/recipes/_components/ErrorMessage';
import PrimaryButton from '@/components/button/PrimaryButton';

type Props = {
  setLoginModalOpen: (v: boolean) => void;
  setStep: React.Dispatch<React.SetStateAction<ModalStep>>;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  registersign: UseFormRegister<SignupData>;
  handleSubmitsign: UseFormHandleSubmit<SignupData>;
  errorssign: FieldErrors<SignupData>;
  isValidsign: boolean;
  isSubmittingsign: boolean;
  email: string;
};

const LoginModal = ({
  setLoginModalOpen,
  setStep,
  setMode,
  registersign,
  handleSubmitsign,
  errorssign,
  isValidsign,
  isSubmittingsign,
  email,
}: Props) => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  //Emailをここでマスク表示
  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name.slice(0, 2)}***@${domain}`;
  };

  //ログイン処理
  const onSubmitPass = async (data: SignupData) => {
    if (!data.password) {
      alert('パスワードが必要です');
      return;
    }
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email, // さっき入力したやつをstateから
      password: data.password,
    });

    if (error) {
      console.error(error);

      if (error.message.includes('Invalid login credentials')) {
        alert('入力された情報が正しくありません');
      } else {
        alert('ログインに失敗しました');
      }

      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return;
    }
    if (!error) {
      await fetch('/api/sync-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: authData.user?.email,
        }),
      });
      setLoginModalOpen(false);
      setStep('select');
      router.push('/home');
    }
  };
  return (
    <div className="flex  justify-center">
      <form onSubmit={handleSubmitsign(onSubmitPass)}>
        <div className="flex flex-col justify-center">
          <label className="flex justify-center mt-8 mb-2 font-semibold">
            メールアドレス
          </label>

          <p className="flex justify-center mb-6">{maskEmail(email)}</p>

          <label className="flex justify-center mb-2 font-semibold">
            パスワードを入力してください
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...registersign('password', {
                required: 'パスワードは必須です',
              })}
              placeholder="パスワードを入力"
              className="border px-2 py-1 w-full"
            ></input>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)} //prev（今の状態）→!prev（反対の状態）＝今の状態を反対の状態にする
              className="absolute right-2 top-1 mt-0.5"
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
          <div className="pl-2 mb-2 mt-2">
            {errorssign.password && (
              <ErrorMessage error={errorssign.password} />
            )}
          </div>

          <div className="mt-8">
            <div className="flex justify-center">
              <PrimaryButton
                type="submit"
                disabled={!isValidsign || isSubmittingsign}
                className="w-60 h-11"
                variant="primary"
              >
                {isSubmittingsign ? 'ログイン中...' : 'ログイン'}
              </PrimaryButton>
            </div>
            <div className="flex justify-center pt-2 border-b text-sm">
              <button
                onClick={() => {
                  setMode('reset');
                  setStep('resetEmail');
                }}
              >
                パスワード忘れた方はこちら
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginModal;
