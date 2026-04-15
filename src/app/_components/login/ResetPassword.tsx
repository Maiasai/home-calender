//パスワード再設定モーダル

import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import Image from 'next/image';
import { useEffect } from 'react';
import { SignupData } from '@/_types/SignupData';
import { supabase } from '@/_libs/supabase';
import { ModalStep } from './_typs/ModalStep';
import PasswordInput from './PasswordInput';

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
          {/* パスワード */}

          <div>
            <PasswordInput
              registersign={registersign}
              watch={watch}
              errorssign={errorssign}
            />
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
      </form>
    </div>
  );
};

export default ResetPassword;
