//タイトル　UI周り
'use client';

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';
import Image from 'next/image';
import { RecipeFormValues } from '../_types/RecipeFormValues';

type Props = {
  registerTitle: UseFormRegister<RecipeFormValues>;
  errors: FieldErrors<RecipeFormValues>;
};

const TitleForm = ({ registerTitle, errors }: Props) => {
  return (
    <div className="flex flex-col">
      <label>タイトル</label>

      <div className="flex items-center max-w-md">
        <input
          {...registerTitle('title', {
            required: 'レシピ名は必須です',
            maxLength: {
              value: 30,
              message: ' レシピ名は30文字以内で入力してください ',
            },
          })}
          placeholder="レシピ名を入力"
          className="flex px-2 py-1 border-b"
        />
        <Image
          src="/images/pencil01.png"
          alt="レシピ名入力右アイコン"
          className="w-4 h-4 opacity-60"
          width={20}
          height={20}
        />
      </div>
      <ErrorMessage error={errors.title} />
    </div>
  );
};

export default TitleForm;
