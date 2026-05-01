//メモ　UI周り

'use client';

import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { RecipeFormValues } from '../_types/RecipeFormValues';

type Props<T extends FieldValues> = {
  registerMemo: UseFormRegister<T>;
};

const MemoForm = <T extends FieldValues>({ registerMemo }: Props<T>) => {
  return (
    <div className="w-full flex flex-col">
      <label>メモ</label>

      <textarea
        className="w-full border p-2 py-1 rounded-lg"
        {...registerMemo('memo' as Path<T>, {
          maxLength: {
            value: 1000,
            message: ' メモ1000文字以内で入力してください ',
          },
        })}
        placeholder="メモを入力"
      />
    </div>
  );
};

export default MemoForm;
