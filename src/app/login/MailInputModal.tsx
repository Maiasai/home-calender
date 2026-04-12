//メールアドレス入力モーダル（初回ユーザーか既存ユーサーかを判定）
'use client';

import Image from 'next/image';
import signInWithGoogle from './hooks/SignInWithGoogle';
import { EmailFormValues } from '@/_types/Emailformvalues';
import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import ErrorMessage from '../_components/recipe/components/ErrorMessage';

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
          <div className="pl-2">
            {errors.email && <ErrorMessage error={errors.email} />}
          </div>
        </div>

        <label className="flex items-center justify-center whitespace-pre-line text-sm m-6">
          {`メールアドレスが登録済みかどうかを確認し、
          お持ちでない場合はそのまま新規登録ができます。`}
        </label>

        <div className="flex items-center justify-center mb-10 w-full">
          <button
            disabled={!isValid || isSubmitting} //バリデーション表示,送信中はtureになる→true時はボタン無効
            className={`transition${
              !isValid || isSubmitting
                ? 'opacity-50 grayscale cursor-not-allowed'
                : ''
            }`}
          >
            <Image
              src="/images/nextbutton.png"
              alt="次へボタン"
              width={229}
              height={34}
            />
          </button>
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

      <button onClick={signInWithGoogle} className="flex w-full justify-center">
        <Image
          src="/images/Sign up with Google.png"
          alt="googleで続ける"
          width={178}
          height={39}
        />
      </button>
    </div>
  );
};

export default MailInputModal;
