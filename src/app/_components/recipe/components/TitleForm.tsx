//タイトル　UI周り

'use client'

import { RecipeFormValues } from "@/app/_components/recipe/_types/RecipeFormValues"
import { FieldErrors, UseFormRegister } from "react-hook-form"


type Props = {
registerTitle : UseFormRegister<RecipeFormValues>
errors : FieldErrors<RecipeFormValues>
}

const TitleForm = ({ registerTitle , errors } : Props) => {

  return(
    <div className='flex flex-col'>
    <label>タイトル</label>

      <div className="flex items-center max-w-md">
        <input
          {...registerTitle('title',{
            required:"レシピ名は必須です",
            maxLength : {
              value : 30,
              message : " レシピ名は30文字以内で入力してください "
            }
          })}
          placeholder="レシピ名を入力"
          className="flex-1 py-2 px-2 border-b"
        />
        <img
          src="/images/pencil01.png"
          className="w-4 h-4 opacity-60"
        />
      </div>
    {errors.title && (<p className="text-red-500">{errors.title.message}</p>)}
</div>
  )
}

export default TitleForm;