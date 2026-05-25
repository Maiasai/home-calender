//ログイン

'use client';

import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import { ModalStep } from '../_typs/ModalStep';
import { SignupData } from '@/app/login/_typs/SignupData';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import Image from 'next/image';
import { Mode } from '../_typs/mode';
import ErrorMessage from '@/app/(main)/recipes/_components/ErrorMessage';

type Props = {
  setLoginModalOpen: (v: boolean) => void;
  setStep: React.Dispatch<React.SetStateAction<ModalStep>>;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  registersign: UseFormRegister<SignupData>;
  handleSubmitsign: UseFormHandleSubmit<SignupData>;
  watch: UseFormWatch<SignupData>;
  errorssign: FieldErrors<SignupData>;
  isValidsign: boolean;
  isSubmittingsign: boolean;
  loading: boolean;
  setLoading: (v: boolean) => void;
  email: string;
};

const LoginModal = ({
  setLoginModalOpen,
  setStep,
  setMode,
  registersign,
  handleSubmitsign,
  watch,
  errorssign,
  isValidsign,
  isSubmittingsign,
  loading,
  setLoading,
  email,
}: Props) => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const password = watch('password'); // password の値を常に取得

  //Emailをここでマスク表示
  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name.slice(0, 2)}***@${domain}`;
  };

  //ログイン処理
  const onSubmitPass = async (data: SignupData) => {
    if (!data.password) {
      alert('パスワードが必要です');
      setLoading(false);
      return;
    }
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email, // さっき入力したやつをstateから
      password: data.password,
    });

    setLoading(false);

    if (error) {
      console.error(error);

      if (error.message.includes('Invalid login credentials')) {
        alert('パスワードが正しくありません');
      } else {
        alert('ログインに失敗しました');
      }

      return;
    }
    if (!error) {
      await fetch('/api/sync-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
              className="absolute right-2 top-1"
            >
              <Image
                src={
                  showPassword
                    ? '/images/eye-solid-full.svg'
                    : '/images/eye-slash-solid-full.svg'
                }
                alt={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                width={24}
                height={24}
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
              <button
                type="submit"
                disabled={!isValidsign || isSubmittingsign}
                className={`w-60 h-11 rounded-2xl bg-orange-500 text-white font-medium shadow-md transition-all duration-150 active:scale-95 active:translate-y-[1px] ${!isValidsign || isSubmittingsign ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-orange-600'}`}
              >
                ログイン
              </button>
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
