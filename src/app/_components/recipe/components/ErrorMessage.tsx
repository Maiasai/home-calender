//エラーメッセージUI
'use client'

type Props = {
  error?: {
    message?: string
  }
}

const ErrorMessage = ({ error }:Props) => (
  // エラーが無くても最低16pxの高さを確保する
  <div className="min-h-[16px]">
    {error?.message && (
      <p className="text-red-500 text-xs">
        {error.message}
      </p>
    )}
  </div>
)

export default ErrorMessage;