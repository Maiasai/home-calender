//認証コード入力モーダル（ログイン時）
'use client';

import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import { VerifyCodeFormValues } from '@/app/login/_typs/VerifyCodeFormValues';
import ErrorMessage from '@/app/(main)/recipes/_components/ErrorMessage';
import ModalDescriptionText from './ModalDescriptionText';
import PrimaryButton from '@/components/button/PrimaryButton';

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
      <ModalDescriptionText>
        {`ご入力いただいたメールアドレス宛に、
        登録を続けるための確認コードを
        送信しました。
    
        メールに記載された確認コードを
        入力してください。`}
      </ModalDescriptionText>

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
          <div className="pl-2 mt-2">
            {otpErrors.otp && <ErrorMessage error={otpErrors.otp} />}
          </div>
        </div>

        <div className="flex items-center justify-center mb-2">
          <PrimaryButton
            type="submit"
            disabled={!otpValid || otpSubmit} //バリデーション表示,送信中はtureになる→true時はボタン無効
            className="w-60 h-11"
            variant="primary"
          >
            確認する
          </PrimaryButton>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="text-xs mt-2 border-b"
            onClick={() => sendOtp(email)}
          >
            コードを再送する
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyCodeMailInputModal;
