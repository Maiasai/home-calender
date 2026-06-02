//パスワード再設定メールアドレス入力

'use client';
import { EmailFormValues } from '@/app/login/_typs/Emailformvalues';
import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import ErrorMessage from '@/app/(main)/recipes/_components/ErrorMessage';
import PrimaryButton from '@/components/button/PrimaryButton';

type Props = {
  register: UseFormRegister<EmailFormValues>;
  errors: FieldErrors<EmailFormValues>;

  onSubmit: SubmitHandler<EmailFormValues>;
  handleSubmit: UseFormHandleSubmit<EmailFormValues>;
  isValid: boolean;
  isSubmitting: boolean;
};

const ResetEmail = ({
  register,
  errors,
  onSubmit,
  handleSubmit,
  isValid,
  isSubmitting,
}: Props) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-center flex-col">
        <label className="pt-8 mx-4 mt-6">登録済みのメールアドレス</label>

        <div className="mb-4 w-full">
          <input
            type="email"
            {...register('email', {
              required: 'メールアドレスは必須です',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '正しいメールアドレスを入力してください',
              },
            })}
            placeholder="exsample@email.com"
            className="border w-full p-2 mx-4"
          />
          <div className="pl-6 mt-2">
            {errors.email && <ErrorMessage error={errors.email} />}
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <PrimaryButton
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-60 h-11"
            variant="primary"
          >
            認証メールを送信ボタン
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
};

export default ResetEmail;
