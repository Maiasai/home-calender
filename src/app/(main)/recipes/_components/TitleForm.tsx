//タイトル　UI周り
'use client';

import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';
import ErrorMessage from './ErrorMessage';
import Image from 'next/image';
import { RecipeModalStep } from '../_types/RecipeModalStep';

//Tに親のuseFormで書いた型が入る。
type Props<T extends FieldValues> = {
  //T extends FieldValuesの意味→Tにはフォーム用のオブジェクト型だけ入れてね
  registerTitle: UseFormRegister<T>;
  errors: FieldErrors<T>;
  step?: RecipeModalStep;
};

//T extends FieldValuesの意味→このコンポーネントは T という型を使えます。ただし T はフォーム用オブジェクト型だけにしてね
const TitleForm = <T extends FieldValues>({
  registerTitle,
  errors,
  step,
}: Props<T>) => {
  return (
    <div className="flex flex-col w-full">
      <label>{step === 'MANUAL' && 'タイトル'}</label>

      <div className="flex w-full≈">
        <input
          {...registerTitle('title' as Path<T>, {
            //title は Tの中で使えるキーとして扱ってくださいとここで指定
            required: 'レシピ名は必須です',
            maxLength: {
              value: 30,
              message: 'レシピ名は30文字以内で入力してください ',
            },
          })}
          placeholder="レシピ名を入力"
          className={
            step === 'MANUAL' ? 'w-full px-2 py-1 border-b' : 'w-full px-2'
          }
        />
        {step === 'MANUAL' && (
          <Image
            src="/images/pencil01.png"
            alt="レシピ名入力右アイコン"
            className="w-4 h-4 opacity-60"
            width={20}
            height={20}
          />
        )}
      </div>

      {/* エラーの型がオリジナルでもurlでも汎用で使えるようになったため、ここで１個のinputエラーと指定 */}
      <ErrorMessage error={errors.title as FieldError} />
    </div>
  );
};

export default TitleForm;
