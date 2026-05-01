//エラーメッセージUI
'use client';

import { FieldError } from 'react-hook-form'; //register した入力欄がバリデーション失敗した時に、errors の中へ入るエラー情報の型

type Props = {
  error?: FieldError;
};

const ErrorMessage = ({ error }: Props) => (
  // エラーが無くても最低16pxの高さを確保する
  <div className="min-h-[16px]">
    {error?.message && <p className="text-red-500 text-xs">{error.message}</p>}
  </div>
);

export default ErrorMessage;
