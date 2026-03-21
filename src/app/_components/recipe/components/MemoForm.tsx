//メモ　UI周り

'use client'

import { RecipeFormValues } from "@/app/_components/recipe/_types/RecipeFormValues"
import { UseFormRegister } from "react-hook-form"


type Props = {
registerMemo : UseFormRegister<RecipeFormValues>
}

const MemoForm = ({ registerMemo } : Props) => {

  return(
    <div className='w-full flex flex-col'>
    <label>メモ</label>
    <textarea
      className="w-full border p-2 rounded-lg"
      {...registerMemo('memo')}
        placeholder="メモを入力"
      />
  </div>   
  )
}

export default MemoForm;