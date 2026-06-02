//メールアドレス入力モーダル（初回ユーザーか既存ユーサーかを判定）
'use client';

import Image from 'next/image';
import signInWithGoogle from './SignInWithGoogle';
import { EmailFormValues } from '@/app/login/_typs/Emailformvalues';
import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import ErrorMessage from '@/app/(main)/recipes/_components/ErrorMessage';
import { GoogleMaterial } from './GoogleMeterial';
import ModalDescriptionText from './ModalDescriptionText';
import PrimaryButton from '@/components/button/PrimaryButton';

type Props = {
  handleSubmit: UseFormHandleSubmit<EmailFormValues>;
  onSubmit: SubmitHandler<EmailFormValues>;
  register: UseFormRegister<EmailFormValues>;
  errors: FieldErrors<EmailFormValues>;
  isSubmitting: boolean;
  isValid: boolean;
};

const MailInputModal = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
  isSubmitting,
  isValid,
}: Props) => {
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)} //バリデーションが通ったらonSubmit(data)を呼ぶ
      >
        <div className="mb-4 pt-6 px-5">
          <input
            type="email"
            {...register('email', {
              //ここがinputの値管理とバリデーションを担当
              required: 'メールアドレスは必須です',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '正しいメールアドレスを入力してください',
              },
            })}
            placeholder="exsample@email.com"
            className="border w-full p-2"
          />
          <div className="pl-2 mt-2">
            {errors.email && <ErrorMessage error={errors.email} />}
          </div>
        </div>

        <ModalDescriptionText>
          {`メールアドレスが登録済みかどうかを
            確認し、お持ちでない場合はそのまま新規登録ができます。`}
        </ModalDescriptionText>

        <div className="flex items-center justify-center mb-10 w-full">
          <PrimaryButton
            disabled={!isValid || isSubmitting} //バリデーション表示,送信中はtureになる→true時はボタン無効
            className="w-60 h-11 rounded-2xl font-medium shad active:scale-95 active:translate-y-[1px] "
          >
            次へ
          </PrimaryButton>
        </div>
      </form>

      <div className="w-full mb-6">
        <Image
          src="/images/or.png"
          alt="またはの画像"
          width={400}
          height={10}
        />
      </div>

      <div className="flex justify-center mb-8">
        <GoogleMaterial signInWithGoogle={signInWithGoogle} />
      </div>
    </div>
  );
};

export default MailInputModal;
