'use client';
import { SignupData } from '@/_types/SignupData';
import Image from 'next/image';
import { useState } from 'react';
import { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form';
import ErrorMessage from '../recipe/components/ErrorMessage';

type Props = {
  registersign: UseFormRegister<SignupData>;
  watch: UseFormWatch<SignupData>;
  errorssign: FieldErrors<SignupData>;
};
const PasswordInput = ({ registersign, watch, errorssign }: Props) => {
  const [showPassword, setShowPassword] = useState(false); //パスワード入力欄を 表示/非表示 にする boolean
  const [showConfirm, setShowConfirm] = useState(false);
  const password = watch('password'); // password の値を常に取得

  return (
    <div>
      <div className="flex items-center justify-center mb-2 text-base font-semibold">
        <label>パスワードを作成</label>
      </div>

      <div className="relative mb-2">
        <input
          type={showPassword ? 'text' : 'password'}
          {...registersign('password', {
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
        <div className="pl-2 mb-2">
          {errorssign.password && <ErrorMessage error={errorssign.password} />}
        </div>
        <p className="whitespace-pre-line text-xs mb-2 pl-2">
          {`※英数字含めた6文字以上12文字以内にする必要があります`}
        </p>
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
        <div className="pl-2 mb-16">
          {errorssign.confirmPassword && (
            <ErrorMessage error={errorssign.confirmPassword} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordInput;
