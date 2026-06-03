//新規登録またはログイン　モーダル

'use client';

import Image from 'next/image';
import { ModalStep } from '../_typs/ModalStep';
import signInWithGoogle from './SignInWithGoogle';
import { Mail } from 'lucide-react';
import { GoogleMaterial } from './GoogleMeterial';
import PrimaryButton from '@/components/button/PrimaryButton';

type Props = {
  setStep: React.Dispatch<React.SetStateAction<ModalStep>>;
};

const LoginSelectModal = ({ setStep }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center mb-20">
        <Image
          src="/images/rogo.png"
          alt="サイトのロゴ"
          width={233}
          height={51}
        />
      </div>

      <h1 className="flex justify-center text-lg mb-6 font-semibold">
        新規登録またはログイン
      </h1>

      <div className="flex justify-center mb-8">
        <GoogleMaterial signInWithGoogle={signInWithGoogle} />
      </div>

      <div className="flex justify-center mb-6">
        <Image
          src="/images/or.png"
          alt="またはの画像"
          width={400}
          height={10}
        />
      </div>

      <div className="flex justify-center">
        <PrimaryButton
          onClick={() => setStep('email')}
          className="flex items-center justify-center gap-2
            w-40 h-11"
          variant="primary"
        >
          <Mail size={18} />
          メールで続ける
        </PrimaryButton>
      </div>
    </div>
  );
};

export default LoginSelectModal;
