//レシピ削除確認ダイアログ

'use client'

type Props = {
  open: boolean
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void
}

const ConfirmDialog = ({
  open,
  title,
  message,
  onCancel,
  onConfirm
}: Props) => {

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[300px]">

        <p className="text-lg font-bold mb-3">
          {title}
        </p>

        <p className="text-sm mb-5">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-3 py-1 border rounded"
          >
            キャンセル
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            削除
          </button>
        </div>

      </div>
    </div>
  )
}

export default ConfirmDialog