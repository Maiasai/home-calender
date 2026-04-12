//パスワード再設定モーダル

import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import ErrorMessage from '../_components/recipe/components/ErrorMessage';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SignupData } from '@/_types/SignupData';
import { supabase } from '@/_libs/supabase';
import { ModalStep } from './_typs/ModalStep';
import { EmailFormValues } from '@/_types/Emailformvalues';

type Props = {
  registersign: UseFormRegister<SignupData>;
  handleSubmitsign: UseFormHandleSubmit<SignupData>;
  errorssign: FieldErrors<SignupData>;
  watch: UseFormWatch<SignupData>;
  setStep: React.Dispatch<React.SetStateAction<ModalStep>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};

const ResetPassword = ({
  registersign,
  handleSubmitsign,
  errorssign,
  watch,
  setStep,
  setEmail,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false); //パスワード入力欄を 表示/非表示 にする boolean
  const [showConfirm, setShowConfirm] = useState(false);

  const password = watch('password'); // password の値を常に取得

  const handleResetPassword: SubmitHandler<SignupData> = async (data) => {
    const { password, confirmPassword } = data;

    if (!password || !confirmPassword) {
      //これを入れることでこの先の password は string 確定とする
      alert('パスワードを入力してください');
      return;
    }

    if (password !== confirmPassword) {
      alert('パスワードが一致しません');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      if (error.message.includes('New password should be different')) {
        alert(
          '同じパスワードは使用できません。別のパスワードを入力してください。',
        );
        return;
      }

      console.error(error);
      alert('パスワードの更新に失敗しました');
      return;
    }

    alert('パスワードを更新しました');
    setStep('login');
  };

  useEffect(() => {
    const getUserEmail = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setEmail(user.email);
      }
    };

    getUserEmail();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmitsign(handleResetPassword)}>
        <div>
          <div className="relative mb-2 mt-10">
            <input
              type={showPassword ? 'text' : 'password'}
              {...registersign('password', {
                required: 'パスワードは必須です',
                minLength: {
                  value: 8,
                  message: '8文字以上で入力してください',
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                  message: '英字と数字を含めてください',
                },
              })}
              placeholder="パスワードを入力"
              className="border px-2 py-1 w-full"
            />
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
            <p className="whitespace-pre-line text-xs mb-4 pl-2">
              {`※英数字含めた8文字以上にする必要があります`}
            </p>
            <div className="pl-2 mb-2">
              {errorssign.password && (
                <ErrorMessage error={errorssign.password} />
              )}
            </div>

            <div className="relative mb-10">
              <input
                type={showConfirm ? 'text' : 'password'}
                {...registersign('confirmPassword', {
                  required: '確認用パスワードは必須です',
                  validate: (value) =>
                    value === password || 'パスワードが一致しません',
                })}
                placeholder="パスワードを入力（確認）"
                className="border p-2 px-2 py-1 w-full "
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)} //prev（今の状態）→!prev（反対の状態）＝今の状態を反対の状態にする
                className="absolute right-2 top-1"
              >
                <Image
                  src={
                    showConfirm
                      ? '/images/eye-solid-full.svg'
                      : '/images/eye-slash-solid-full.svg'
                  }
                  alt={showConfirm ? 'パスワードを隠す' : 'パスワードを表示'}
                  width={24}
                  height={24}
                />
              </button>

              <div className="pl-2 mb-8">
                {errorssign.confirmPassword && (
                  <ErrorMessage error={errorssign.confirmPassword} />
                )}
              </div>
              <div className="flex justify-center mt-2">
                <button>
                  <Image
                    src="/images/updatepass.png"
                    alt="パスワード更新ボタン"
                    width={200}
                    height={34}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
