//手順　UI部分
'use client'

import { FieldErrors, UseFormRegister } from "react-hook-form"
import DeleteIcon from "../../image/deleteicon"
import ErrorMessage from "./ErrorMessage"
import { RecipeFormValues } from "../_types/RecipeFormValues"
import Image from "next/image"

export type Step = { 
  recipestep :string
}


type Props = {
  fields : {id:string}[]//fieldsは何こ入力欄があるか　→　fields = [{id},{id}]
  append : (value:Step|Step[])=>void//単体か配列の可能性がある
  remove : (index:number)=>void
  register : UseFormRegister<RecipeFormValues>//Formの構造を元にregister関数を作る型
  errors : FieldErrors<RecipeFormValues> //Formと同じ構造でエラーだけ持つオブジェクト
}

const StepList = ({
  fields,append,remove,register,errors
}:Props) => {
  const MAX_STEP = 20//最大追加可能数

  return(
    <div className='flex flex-col w-full gap-2'>
      <label>作り方</label>


        {fields.map ((field, index) => (//fieldには Reactが行を識別するid→{ id: "abc123" }、indexには何番目かが入る
          <div key={field.id}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              {index >= 1 &&(
                <button
                  type='button'
                  onClick={()=>remove(index)}//何番目かで削除
                  aria-label="手順を削除"
                >
                  <DeleteIcon />
                </button>
              )}

              <span>{index+1}.</span>
              <input
                className="w-3/4 px-2 py-1 border-b"
                {...register(`steps.${index}.recipestep`,{
                  required:"手順は必須です",
                  maxLength : {
                    value : 50,
                    message : " 手順は50文字以内で入力してください "
                  },
                })}//...register(フィールドの場所,バリデーション)
                  placeholder="手順を入力"
              />
            </div>

            <div className="pl-10">
              <ErrorMessage 
                error={errors.steps?.[index]?.recipestep}
              />
            </div>
          </div>
        ))}
        


        {fields.length < 20 && (//最大数超えたら追加ボタンを非表示
          <div className="flex justify-center">
            <button
              type='button'
              onClick={()=> append({recipestep:""})}
              className="cursor-pointer"
            >
              <Image
                src="/images/buttonstepadd.png"
                alt="手順を追加"
                width={100}
                height={40}
              />
            </button>
          </div>
        )}
    </div>
  )
}
export default StepList;
