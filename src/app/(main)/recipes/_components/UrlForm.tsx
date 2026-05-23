//Url入力　UI周り
'use client';

import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';
import ErrorMessage from './ErrorMessage';

type Props<T extends FieldValues> = {
  registerUrl: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

const UrlForm = <T extends FieldValues>({ registerUrl, errors }: Props<T>) => {
  return (
    <div className="flex flex-col items-start ">
      <p className="flex items-center w-full text-base text-gray-500 mb-1 ml-2 mt-1 ">
        レシピURLを貼り付けてください
      </p>
      <p className="ml-4 text-sm">※手入力も可</p>

      <input
        {...registerUrl('sourceUrl' as Path<T>, {
          required: 'レシピURLは必須です',
          maxLength: {
            value: 2048,
            message: 'レシピURLは2048文字以内で入力してください ',
          },
        })}
        placeholder="例：https://example.com/recipe"
        className={'w-full px-2 py-1 border-b'}
      />

      <ErrorMessage error={errors.sourceUrl as FieldError} />
    </div>
  );
};

export default UrlForm;
