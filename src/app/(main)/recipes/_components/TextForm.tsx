//テキスト入力　UI周り
'use client';

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';
import { CreateRecipeByTextRequest } from '../_types/CreateRecipeByTextRequest';

type Props = {
  registerText: UseFormRegister<CreateRecipeByTextRequest>;
  errors: FieldErrors<CreateRecipeByTextRequest>;
};

const TextForm = ({ registerText, errors }: Props) => {
  return (
    <div className="w-full">
      <textarea
        {...registerText('sourceText', {
          required: 'テキストは必須です',
          maxLength: {
            value: 2048,
            message: 'テキストは2048文字以内で入力してください ',
          },
        })}
        placeholder="材料と作り方のテキストをそのまま貼り付けてください"
        className={'w-full px-2 py-1 min-h-[120px] resize-none'}
      />

      <ErrorMessage error={errors.sourceText} />
    </div>
  );
};

export default TextForm;
