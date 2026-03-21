//サインアップページ→認証は済んでいる前提で、users未登録ユーザーだけに登録処理をさせるページ

'use client'

import { supabase } from "@/_libs/supabase"
import { SignupData } from "@/_types/SignupData"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"



const SignupPage = () => {
  const router = useRouter()
  const [ loading , setLoading ] = useState(true)
  const { register , handleSubmit ,formState:{errors} } = useForm<SignupData>();


  //認証済みかチェック
  useEffect (()=>{
    const checkUser = async () => {
      const {data:{user}}=await supabase.auth.getUser()

    if (!user){
      router.push('/')
      return
    }
  

    const { data: existingUser } = await supabase//既存ユーザーがusersテーブルにいるかチェック
    .from('users')
    .select('id')
    .eq('email', user.email)
    .maybeSingle()

    if (existingUser) {
      router.push('/home')
      return
    }
    setLoading(false)

    }
    checkUser()
  },[router])

  //登録処理

  const onSubmit = async (data:SignupData) => {
    setLoading(true)

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
 
      setLoading(false)

    if (!res.ok) {
      alert('登録に失敗しました')
      return
    }

    router.push('/home')
    
    }

    if(loading){
      return <p className="p-6">読み込み中...</p>
    }
  

  return(
    <div>
      <h1>新規登録</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}>
        
          <input
            type="text"
            {...register('nickname',{
              required:"ニックネームは必須です",
              maxLength:{
                value : 10,
                message : "10文字以内で入力してください"
              }
            })}
              placeholder="ニックネームを入力"
              className="border w-full p-2"
           />
            {errors.nickname && (<p className="text-red-500">{errors.nickname.message}</p>
            )}

          <input 
            type="tel"
            {...register('phone_number',{
              required:"電話番号は必須です",
              pattern : {
                value : /^[0-9]{11}$/,
                message : "11桁の数字を入力してください",
              }
            })}
              placeholder = "電話番号（例）09012345678"
              className="border w-full p-2"
            />
            {errors.phone_number && (<p className="text-red-500">{errors.phone_number.message}</p>
            )}

          <button
            type = "submit"
            className="bg-black text-white w-full py-2"
          >
            登録してはじめる
          
          </button>
        </form>

    </div>

  ) 
}


export default SignupPage
