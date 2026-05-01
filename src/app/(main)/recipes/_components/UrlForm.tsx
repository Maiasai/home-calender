//Url入力　UI周り
'use client';

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';
import { CreateRecipeByUrlRequest } from '../_types/CreateRecipeByUrlRequest';

type Props = {
  registerUrl: UseFormRegister<CreateRecipeByUrlRequest>;
  errors: FieldErrors<CreateRecipeByUrlRequest>;
};

const UrlForm = ({ registerUrl, errors }: Props) => {
  return (
    <div className="flex flex-col items-start ">
      <p className="flex items-center w-full text-sm text-gray-500 mb-1 mt-4">
        レシピURLを貼り付けてください（手入力も可）
      </p>
      <input
        {...registerUrl('sourceUrl', {
          required: 'レシピURLは必須です',
          maxLength: {
            value: 2048,
            message: 'レシピURLは2048文字以内で入力してください ',
          },
        })}
        placeholder="例：https://example.com/recipe"
        className={'w-full px-2 py-1'}
      />

      <ErrorMessage error={errors.sourceUrl} />
    </div>
  );
};

export default UrlForm;
