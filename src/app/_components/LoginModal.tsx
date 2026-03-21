//OTP送信　→　VerifyCode　→　SignupForm　の流れ
//入力は react-hook-form が管理、ステップをまたぐデータだけを state に持ち、Supabase に渡すときは必ず引数で渡す

'use client'

import { useState } from "react";
import { supabase } from "@/_libs/supabase";
import { LoginModalProps } from "@/_types/LoginModalProps";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { VerifyCodeFormValues } from "@/_types/VerifyCodeFormValues";
import { EmailFormValues } from "@/_types/Emailformvalues";


type ModalStep =  //意）ModalStepという型は'select' か 'email'　どちらかしか使えない
	| 'select' //メールor他の選択
	| 'email' //メール入力
	| 'verifyCode' //新規；認証コード入力
	| 'signup' //新規；登録



const LoginModal = ({ open , onClose } : LoginModalProps ) => {
	const [step,setStep] = useState < ModalStep > ('select')
	const [otp,setOtp] = useState('')
	const [loading,setLoading] = useState(false)
	const [email,setEmail] = useState('')//verifyCode ステップや signup ステップでも email を参照するため用

	const router =  useRouter()

	const { register , handleSubmit , formState:{errors} } = useForm<EmailFormValues>();
	const { register:registerOtp, handleSubmit: handleSubmitOtp, formState: { errors: otpErrors } } = useForm<VerifyCodeFormValues>();

	if(!open) return null;


	//Google ログイン(ここでgoogle認証画面へリダイレクト)
	const signInWithGoogle = async () =>{
		const {error} = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,//開発環境用
			},
		})
	
		if (error) {
			console.error(error)
			alert("Googleログイン失敗")
		} 
	}


	//emailに入った値がSupabase に送られる
	const onSubmit = async (data:EmailFormValues) =>{//※ここで渡されるデータ { email: "入力された値" }
		setEmail(data.email)//ステップ間で保持される永続的なデータ
		await sendOtp(data.email);//フォーム送信時だけ存在する一時データ
	}


	const sendOtp = async (targetEmail: string) => {
		setLoading(true)
		const { error } = await supabase.auth.signInWithOtp({//signInWithOtpで認証コードをメールに送っている
			email:targetEmail,
			options: {
				shouldCreateUser: true,//このメールがまだ Supabase Auth に存在しなければ仮ユーザー（Auth user）を作るという指定
			},
		})
		setLoading(false)

		if (error) {
			console.error(error)
			return
		}
		setStep('verifyCode')
	}

	//認証コード入力箇所
	const onSubmitOtp = async (data:VerifyCodeFormValues) => {
		setOtp(data.otp)
		await handleVerifyOtp(data.otp,email);
	}

	//認証コードの入力後に呼ばれる
	const handleVerifyOtp = async (otp:string,targetEmail: string) => {//フォームは { otp } を渡すが、関数は string だけ欲しいため型宣言をここでする
		const { error } = await supabase.auth.verifyOtp({//supabaseの認証窓口に、この情報渡して本人かを確認してもらってるとこ
			email : targetEmail,//コードを送ったメールアドレス
			token : otp,//token→supabase側の呼び名。　otp→inputに入れた8桁のコード
			type:'email',//このOTPはメールで送ったものという意味
		})

		if(error) {
			console.error(error)
			return
		}
		// ★ 認証が成立したらcallback へ
		router.push('/auth/callback')
		onClose()
	}



	return (
		<div className = "fixed inset-0 bg-black/40 flex items-center justify-center ">
				{/* 中央の箱 */}
				<div className= "bg-white w-[400px] p-6 rounded-lg text-left">

				<button
					onClick={onClose}>
						×
				</button>

				{step === 'select' &&  (
				<>
						<button
							onClick={()=>setStep('email')}>
									メールアドレスで続ける
						</button>

						<button
							onClick={signInWithGoogle}>
								Googleでサインイン
						</button>
					</>	
				)}

				{step === 'email' && (
					<div>
						<button
							onClick={()=>setStep('select')}>
								戻る
						</button>

						<p>
							メールアドレス入力フォーム
						</p>

						<form
						  onSubmit={handleSubmit(onSubmit)}//バリデーションが通ったらonSubmit(data)を呼ぶ
						>
							<input
								type="email"
								{...register("email",{//ここがinputの値管理とバリデーションを担当
									required : "メールアドレスは必須です",
									pattern:{
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "正しいメールアドレスを入力してください"
									}
								})}
								placeholder = "exsample@email.com"
								className="border w-full p-2"
							/>
							 {errors.email && <p className="text-red-500">{errors.email.message}</p>}


							<button
								type="submit"
							>
								次へ
							</button>								
						</form>

					</div>
				)}


				{step === 'verifyCode' && (
					<div>
						<p>
							メールに届いた認証コードを入力してください
						</p>

						<form
						  onSubmit={handleSubmitOtp(onSubmitOtp)}
						>

							<input
								type="text"
								{...registerOtp("otp",{
									required:"認証コードは必須です",
									pattern : {
										value : /^[0-9]{8}$/,
										message : "8桁の数字を入力してください"
									}
								})}
								placeholder="認証コードを入力"
							/>
							{otpErrors.otp &&<p className="text-red-500">{otpErrors.otp.message}</p> }

							<button
								type="submit"
							>
									確認する
							</button>

						</form>
					</div>
				)} 

				</div>
		</div>

	)
}

export default LoginModal;