//認証コード入力モーダル（ログイン時）
'use client';

import Image from 'next/image';
import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import ErrorMessage from '../recipe/components/ErrorMessage';
import { VerifyCodeFormValues } from '@/_types/VerifyCodeFormValues';

type Props = {
  handleSubmitOtp: UseFormHandleSubmit<VerifyCodeFormValues>;
  onSubmitOtp: SubmitHandler<VerifyCodeFormValues>;
  registerOtp: UseFormRegister<VerifyCodeFormValues>;
  otpErrors: FieldErrors<VerifyCodeFormValues>;
  otpSubmit: boolean;
  otpValid: boolean;
  sendOtp: (email: string) => Promise<void>;
  email: string;
};

const VerifyCodeMailInputModal = ({
  handleSubmitOtp,
  onSubmitOtp,
  registerOtp,
  otpErrors,
  otpSubmit,
  otpValid,
  sendOtp,
  email,
}: Props) => {
  return (
    <div>
      <label className="flex items-center justify-center whitespace-pre-line text-center text-sm m-6">
        {`ご入力いただいたメールアドレス宛に、
        登録を続けるための確認コードを送信しました。
    
        メールに記載された確認コードを入力してください。`}
      </label>

      <form onSubmit={handleSubmitOtp(onSubmitOtp)}>
        <div className="m-10">
          <input
            type="text"
            {...registerOtp('otp', {
              required: '認証コードは必須です',
              pattern: {
                value: /^[0-9]{8}$/,
                message: '8桁の数字を入力してください',
              },
            })}
            placeholder="認証コードを入力"
            className="border w-full p-2"
          />
          <div className="pl-2">
            {otpErrors.otp && <ErrorMessage error={otpErrors.otp} />}
          </div>
        </div>

        <div className="flex items-center justify-center mb-2">
          <button
            type="submit"
            disabled={!otpValid || otpSubmit} //バリデーション表示,送信中はtureになる→true時はボタン無効
            className={`transition${
              !otpValid || otpSubmit
                ? 'opacity-50 grayscale cursor-not-allowed'
                : ''
            }`}
          >
            <Image
              src="/images/confirmationbutton.png"
              alt="確認ボタン"
              width={100}
              height={10}
            />
          </button>
        </div>
        <div className="flex justify-center items-center">
          <button onClick={() => sendOtp(email)}>コードを再送する</button>
        </div>
      </form>
    </div>
  );
};

export default VerifyCodeMailInputModal;
