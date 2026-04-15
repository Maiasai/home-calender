//OTP送信　→　VerifyCode　→　SignupForm　の流れ
//入力は react-hook-form が管理、ステップをまたぐデータだけを state に持ち、Supabase に渡すときは必ず引数で渡す

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/_libs/supabase';
import { LoginModalProps } from '@/_types/LoginModalProps';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { VerifyCodeFormValues } from '@/_types/VerifyCodeFormValues';
import { EmailFormValues } from '@/_types/Emailformvalues';
import LoginSelectModal from './LoginSelectModal';
import PageHeader from '../recipe/components/PageHeader';
import MailInputModal from './MailInputModal';
import VerifyCodeMailInputModal from './VerifyCodeMailInputModal';
import { ModalStep } from './_typs/ModalStep';
import LoginModal from './Login';
import { SignupData } from '@/_types/SignupData';
import NewRegistration from './NewRegistration';

import ResetEmail from './ResetEmail';
import ResetPassword from './ResetPassword';
import { Mode } from './_typs/mode';
import { InputEmailData } from './_typs/InputEmailData';

const titles = {
  email: 'メールアドレスを入力',
  verifyCode: '認証コード確認',
  newregistration: '新規登録',
  login: 'ログイン',
  resetEmail: 'パスワード再設定',
  resetPassword: 'パスワード再設定',
};

type CheckEmailResult = {
  exists: boolean;
  authProvider: 'EMAIL' | 'GOOGLE' | null;
};

const LoginFlowModal = ({
  open,
  onClose,
  setLoginModalOpen,
}: LoginModalProps) => {
  const [step, setStep] = useState<ModalStep>('select');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(''); //verifyCode ステップや signup ステップでも email を参照するため用
  const [googleUserEmail, setGoogleUserEmail] = useState<string | null>(null); //Google

  const [mode, setMode] = useState<Mode>('normal');

  const router = useRouter();

  //モードリセット用
  useEffect(() => {
    if (step === 'email') {
      setMode('normal');
    }
  }, [step]);

  //Googleで続ける場合チェック用
  useEffect(() => {
    const fetchUser = async () => {
      const res = await supabase.auth.getUser();
      const user = res.data?.user;
      setGoogleUserEmail(user?.email ?? null);
    };
    fetchUser();
  }, []);

  //①Googleで続ける→Supabase OAuth にリダイレクト
  //②新規登録が必要な場合コールバックページでトップに戻すと同時に URL にフラグを付与→ モーダル内で新規登録フォームを開く
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('signup') === '1') {
      setStep('newregistration'); // 新規登録ステップに
      setLoginModalOpen(true); // モーダル開く
    }
  }, [setLoginModalOpen, setStep]);

  //Email管理用
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EmailFormValues>({ mode: 'onChange' });

  //認証コード管理用
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: {
      errors: otpErrors,
      isValid: otpValid,
      isSubmitting: otpSubmit,
    },
  } = useForm<VerifyCodeFormValues>({ mode: 'onChange' }); //これを書くことでリアルタイムバリデチェックON

  //ニックネーム、パスワード、電話番号管理用
  const {
    register: registersign,
    handleSubmit: handleSubmitsign,
    watch,
    formState: {
      errors: errorssign,
      isValid: isValidsign,
      isSubmitting: isSubmittingsign,
    },
  } = useForm<SignupData>({ mode: 'onChange' });

  //OTP送信
  const sendOtp = async (targetEmail: string) => {
    setLoading(true);

    const res = await fetch('/api/auth/request-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: targetEmail }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setStep('verifyCode');
  };

  //1.メール入力【フォームの入口】　※emailに入った値がSupabase に送られる
  const onSubmitEmail: SubmitHandler<EmailFormValues> = async (
    data: InputEmailData,
  ) => {
    const inputEmail = data.email;

    //※ここで渡されるデータ { email: "入力された値" }
    setEmail(inputEmail); //ステップ間で保持される永続的なデータ

    //①まず存在チェック
    const res = await fetch('/api/users/check-email', {
      method: 'POST', //POST→データを渡して、存在するかどうか調べてもらうため（GETを使わないのは、セキュリティ的なところもある）
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inputEmail }),
    });

    const result: CheckEmailResult = await res.json(); //これが返る→{ exists: boolean(true/false) , authProvider: ('EMAIL' | 'GOOGLE' | null　いずれか)}
    return handleEmailFlow(inputEmail, result);
  };

  //分岐する関数
  const handleEmailFlow = async (email: string, result: CheckEmailResult) => {
    // resetモード→パスワード再設定へ
    if (mode === 'reset') {
      return handleResetEmail(email, result);
    }
    // 既存ユーザー→ログインへ
    if (result.exists) {
      setStep('login');
      return;
    }
    // 新規 → OTP
    return sendOtp(email);
  };

  //Reset専用
  const handleResetEmail = async (email: string, result: CheckEmailResult) => {
    if (!result.exists) {
      alert('未登録です');
      return;
    }
    //Googleアカウントで登録済みのアドレスが入った場合はここでエラーを出す
    if (result.authProvider === 'GOOGLE') {
      // Google登録済み → OTP送信を禁止
      alert(
        'このメールアドレスは Google アカウントで登録されています。Googleでログインしてください',
      );
      return;
    }
    //パスワードリセットメール送信
    await supabase.auth.resetPasswordForEmail(email, {
      //window.location はブラウザが持ってる情報.今アクセスしているURLの情報全部が入ってる。
      redirectTo: `${window.location.origin}/?reset=1`,
    });

    alert(
      'パスワードリセット用のメールを送信しました。\nメール内のリンクをクリックして再設定を行ってください。',
    );
  };

  //認証コード入力箇所
  const onSubmitOtp = async (data: VerifyCodeFormValues) => {
    setOtp(data.otp);
    await handleVerifyOtp(data.otp, email);
  };

  //認証コードの入力後に呼ばれる
  const handleVerifyOtp = async (otp: string, targetEmail: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      //supabaseの認証窓口に、この情報渡して本人かを確認してもらう
      email: targetEmail, //コードを送ったメールアドレス
      token: otp, //token→supabase側の呼び名。　otp→inputに入れた8桁のコード
      type: 'email', //このOTPはメールで送ったものという意味
    });
    if (error) {
      console.error(error);
      alert('コードが間違っているか、有効期限が切れています');
      return;
    }
    // 認証成功（data = { session, user }　,error = null}が返る　 → 新規登録 モーダルを開く
    setLoading(false);
    openSignupModal();
  };

  //認証コード入力後に呼ばれる
  const openSignupModal = () => {
    setStep('newregistration');
    setLoginModalOpen(true);
  };

  //URLに ?signup があれば自動でモーダルを開く（Googleで続けた場合のみ）
  useEffect(() => {
    if (window.location.search.includes('signup')) {
      openSignupModal();
    }
  }, []);

  //パスワードリセットモーダル検知
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('reset') === '1') {
      setStep('resetPassword');
      setLoginModalOpen(true);
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center ">
      {/* 中央の箱 */}
      <div className="bg-white p-6 rounded w-[500px] h-[500px] overflow-auto text-left relative">
        {/* 新規登録またはログイン */}
        {step === 'select' && (
          <>
            <PageHeader showClose onClose={onClose} />

            <LoginSelectModal setStep={setStep} />
          </>
        )}
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
            <span className="text-gray-700 font-medium text-lg">処理中…</span>
          </div>
        )}

        {/* メールアドレス入力 */}
        {step === 'email' && (
          <div className="flex justify-center w-full">
            <div className="w-[400px] flex flex-col items-center">
              <div className="w-full">
                <PageHeader
                  title={titles[step]}
                  showBack
                  onBack={() => setStep('select')}
                />
                <MailInputModal
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmitEmail}
                  register={register}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  isValid={isValid}
                />
              </div>
            </div>
          </div>
        )}

        {/* 認証コード確認 */}
        {step === 'verifyCode' && (
          <div>
            <PageHeader
              title={titles[step]}
              showBack
              onBack={() => setStep('select')}
            />

            <VerifyCodeMailInputModal
              handleSubmitOtp={handleSubmitOtp}
              onSubmitOtp={onSubmitOtp}
              registerOtp={registerOtp}
              otpErrors={otpErrors}
              otpSubmit={otpSubmit}
              otpValid={otpValid}
              sendOtp={sendOtp}
              email={email}
            />
          </div>
        )}

        {/* 新規登録 */}
        {step === 'newregistration' && (
          <div className="flex justify-center w-full">
            <div className="w-[400px] flex flex-col items-center">
              <div className="w-full">
                <PageHeader title={titles[step]} />
              </div>

              <div className="w-full">
                <NewRegistration
                  setLoginModalOpen={setLoginModalOpen}
                  setStep={setStep}
                  registersign={registersign}
                  handleSubmitsign={handleSubmitsign}
                  watch={watch}
                  errorssign={errorssign}
                  isValidsign={isValidsign}
                  isSubmittingsign={isSubmittingsign}
                  loading={loading}
                  setLoading={setLoading}
                  googleUserEmail={googleUserEmail}
                />
              </div>
            </div>
          </div>
        )}

        {/* ログイン*/}
        {step === 'login' && (
          <div className="flex justify-center w-full">
            <div className="w-[400px] flex flex-col items-center">
              <div className="w-full">
                <PageHeader
                  title={titles[step]}
                  showBack
                  onBack={() => setStep('email')}
                />
              </div>

              <div className="w-full">
                <LoginModal
                  setLoginModalOpen={setLoginModalOpen}
                  setStep={setStep}
                  setMode={setMode}
                  registersign={registersign}
                  handleSubmitsign={handleSubmitsign}
                  watch={watch}
                  errorssign={errorssign}
                  isValidsign={isValidsign}
                  isSubmittingsign={isSubmittingsign}
                  loading={loading}
                  setLoading={setLoading}
                  email={email}
                />
              </div>
            </div>
          </div>
        )}

        {/* パスワード再設定（メール入力＞認証コード送信）　*/}
        {step === 'resetEmail' && (
          <div className="flex justify-center w-full">
            <div className="w-[400px] flex flex-col items-center">
              <div className="w-full">
                <PageHeader
                  title={titles[step]}
                  showBack
                  onBack={() => setStep('login')}
                />
              </div>

              <div className="w-full">
                <ResetEmail
                  register={register}
                  errors={errors}
                  email={email}
                  onSubmit={onSubmitEmail}
                  handleSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>
        )}

        {/* パスワード再設定（新しいパスワード入力）*/}
        {step === 'resetPassword' && (
          <div className="flex justify-center w-full">
            <div className="w-[400px] flex flex-col items-center">
              <div className="w-full">
                <PageHeader
                  title={titles[step]}
                  showBack
                  onBack={() => setStep('select')}
                />
              </div>

              <ResetPassword
                registersign={registersign}
                handleSubmitsign={handleSubmitsign}
                errorssign={errorssign}
                watch={watch}
                setStep={setStep}
                setEmail={setEmail}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginFlowModal;
