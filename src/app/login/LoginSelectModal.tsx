//新規登録またはログイン　モーダル

'use client';

import Image from 'next/image';
import { ModalStep } from './_typs/ModalStep';
import signInWithGoogle from './hooks/SignInWithGoogle';

type Props = {
  setStep: React.Dispatch<React.SetStateAction<ModalStep>>;
};

const LoginSelectModal = ({ setStep }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center mb-20">
        <Image
          src="/images/Frame324.png"
          alt="サイトのロゴ"
          width={233}
          height={51}
        />
      </div>

      <h1 className="flex justify-center text-lg mb-6 font-semibold">
        新規登録またはログイン
      </h1>

      <button
        onClick={() => {
          signInWithGoogle(); // ここでは redirectTo 付きでリダイレクト
        }}
        className="flex justify-center mb-6"
      >
        <Image
          src="/images/Sign up with Google.png"
          alt="googleで続ける"
          width={178}
          height={39}
        />
      </button>

      <div className="flex justify-center mb-6">
        <Image
          src="/images/or.png"
          alt="またはの画像"
          width={400}
          height={10}
        />
      </div>

      <button
        onClick={() => setStep('email')}
        className="flex justify-center mb-6"
      >
        <Image
          src="/images/mailbutton.png"
          alt="メールで続ける"
          width={232}
          height={39}
        />
      </button>
    </div>
  );
};

export default LoginSelectModal;
