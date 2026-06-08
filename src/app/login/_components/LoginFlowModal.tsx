//OTP送信　→　VerifyCode　→　SignupForm　の流れ
//入力は react-hook-form が管理、ステップをまたぐデータだけを state に持ち、Supabase に渡すときは必ず引数で渡す

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LoginModalProps } from '@/app/login/_typs/LoginModalProps';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { VerifyCodeFormValues } from '@/app/login/_typs/VerifyCodeFormValues';
import { EmailFormValues } from '@/app/login/_typs/Emailformvalues';
import LoginSelectModal from './LoginSelectModal';
import MailInputModal from './MailInputModal';
import VerifyCodeMailInputModal from './VerifyCodeMailInputModal';
import { ModalStep } from '../_typs/ModalStep';
import LoginModal from './Login';
import { SignupData } from '@/app/login/_typs/SignupData';
import NewRegistration from './NewRegistration';

import ResetEmail from './ResetEmail';
import ResetPassword from './ResetPassword';
import { Mode } from '../_typs/mode';
import { InputEmailData } from '../_typs/InputEmailData';
import PageHeader from '@/app/(main)/recipes/_components/PageHeader';
import { useSupabaseSession } from '@/app/(main)/home/_hooks/useSupabaseSession';
import LoadingOverlay from '@/components/LoadingOverlay';

const titles = {
  email: 'メールアドレスを入力',
  verifyCode: '認証コード確認',
  newregistration: '新規登録',
  login: 'ログイン',
  resetEmail: 'パスワード再設定',
  resetPassword: 'パスワード再設定',
};

type CheckEmailResult = {
  //ログイン前判断材料
  exists: boolean;
  authProvider: 'EMAIL' | 'GOOGLE' | null;
};

const LoginFlowModal = ({
  open,
  onClose,
  setLoginModalOpen,
}: LoginModalProps) => {
  const { token } = useSupabaseSession();

  const [step, setStep] = useState<ModalStep>('select');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(''); //verifyCode ステップや signup ステップでも email を参照するため用
  const [authUser, setAuthUser] = useState<any>(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  const [mode, setMode] = useState<Mode>('normal');

  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    //今いるURLに ?signup=1 がなければ、何もしない
    if (searchParams.get('signup') !== '1') return;

    const result = sessionStorage.getItem('authResult'); //ブラウザに一時保存していたデータ取得
    if (!result) return;

    const authResult = JSON.parse(result) as {
      provider: 'google' | 'email';
      isGoogleUser: boolean;
    };

    setIsGoogleUser(authResult.isGoogleUser); //Googleユーザーかどうかをstateに
    setStep('newregistration');
    setLoginModalOpen(true);

    sessionStorage.removeItem('authResult'); //removeItemは一回使ったら消す処理
  }, [setLoginModalOpen]);

  //モードリセット用
  useEffect(() => {
    if (step === 'email') {
      setMode('normal');
    }
  }, [step]);

  //Email管理用
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EmailFormValues>({
    mode: 'onChange',
    defaultValues: {
      email: email,
    },
  });

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

  //ニックネーム、パスワード管理用
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
        Authorization: `Bearer ${token}`,
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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
      if (result.authProvider === 'GOOGLE') {
        alert(
          'このメールアドレスは Google アカウントで登録されています。Googleでログインしてください',
        );
        setStep('select');
        return;
      }
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
      setStep('select');
      return;
    }

    //パスワードリセットメール送信
    await supabase.auth.resetPasswordForEmail(email, {
      //window.location はブラウザが持ってる情報.今アクセスしているURLの情報全部が入ってる。
      redirectTo: `${window.location.origin}/?reset=1`, //redirectTo「メールリンクを押した後、どの画面に戻すか」
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

  //パスワードリセットモーダル検知(ページを開いたときに自動で走る)
  //※セッションは再設定メールリンクを踏んだときに、supabaseが本人確認して発行してくれてる。
  useEffect(() => {
    const handleResetPasswordLink = async () => {
      //ページ開かれたらURLに code か reset=1 があるか見る
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const reset = params.get('reset');

      if (!code && reset !== '1') return;

      //0.5秒だけまつ
      await new Promise((resolve) => setTimeout(resolve, 500));

      //今すでにSupabaseが持っているセッションを取り出す
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert(
          '認証情報が確認できません。もう一度パスワード再設定メールから開いてください。',
        );
        return;
      }
      setStep('resetPassword');
      setLoginModalOpen(true);
    };
    //この関数をこれで動かす
    handleResetPasswordLink();
  }, [setLoginModalOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 ">
      {/* 中央の箱 */}
      <div className="bg-white p-6 rounded w-[500px] h-[590px] overflow-auto text-left relative z-20 m-2">
        {/* 新規登録またはログイン */}
        {step === 'select' && (
          <>
            <PageHeader showClose onClose={onClose} />

            <LoginSelectModal setStep={setStep} />
          </>
        )}
        {isSubmitting && <LoadingOverlay />}

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
                  isGoogleUser={isGoogleUser}
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
                  onSubmit={onSubmitEmail}
                  handleSubmit={handleSubmit}
                  isValid={isValid}
                  isSubmitting={isSubmitting}
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
                isValidsign={isValidsign}
                isSubmittingsign={isSubmittingsign}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginFlowModal;
