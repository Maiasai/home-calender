//レシピ削除確認ダイアログ

'use client';

import Modal from '@/components/Modal';

type Props = {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmDialog = ({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: Props) => {
  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel();
      }}
      title={title}
    >
      <p className="text-sm mb-5">{message}</p>

      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-3 py-1 border rounded">
          キャンセル
        </button>

        <button
          onClick={onConfirm}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          削除
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
