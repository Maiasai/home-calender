import { EmailFormValues } from '@/_types/Emailformvalues';
import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import ErrorMessage from '../_components/recipe/components/ErrorMessage';
import Image from 'next/image';

type Props = {
  register: UseFormRegister<EmailFormValues>;
  errors: FieldErrors<EmailFormValues>;
  email: string;
  onSubmit: SubmitHandler<EmailFormValues>;
  handleSubmit: UseFormHandleSubmit<EmailFormValues>;
};

const ResetEmail = ({
  register,
  errors,
  email,
  onSubmit,
  handleSubmit,
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
            value={email}
          />
          <div className="pl-2">
            {errors.email && <ErrorMessage error={errors.email} />}
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button>
            <Image
              src="/images/sendpasswordreset.png"
              alt="認証メールを送信ボタン"
              width={229}
              height={34}
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ResetEmail;
