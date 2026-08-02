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
  isRequired?: boolean;
};

const UrlForm = <T extends FieldValues>({
  registerUrl,
  errors,
  isRequired,
}: Props<T>) => {
  return (
    <div className="flex flex-col items-start ">
      <div className="flex items-center">
        <p className="flex text-base text-gray-500 mb-1 ml-2 mt-1 ">
          レシピURLを貼り付けてください
        </p>
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </div>
      <p className="ml-2 text-xs">※手入力も可</p>

      <input
        {...registerUrl('sourceUrl' as Path<T>, {
          required: isRequired ? 'レシピURLは必須です' : false,
          maxLength: {
            value: 2048,
            message: 'レシピURLは2048文字以内で入力してください ',
          },
        })}
        placeholder="例：https://example.com/recipe"
        className={'w-full px-2 py-1 border-b mb-1'}
      />

      <div className="ml-4">
        <ErrorMessage error={errors.sourceUrl as FieldError} />
      </div>
    </div>
  );
};

export default UrlForm;
