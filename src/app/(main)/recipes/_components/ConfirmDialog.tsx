//レシピ削除確認ダイアログ

'use client';

import PrimaryButton from '@/components/button/PrimaryButton';
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
      //onOpenChange：モーダルの開閉状態が変わろうとした時に呼ばれる
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel();
      }}
      title={title}
    >
      <p className="text-sm mb-5">{message}</p>

      <div className="flex justify-end gap-3">
        <PrimaryButton
          onClick={onCancel}
          className="w-[90px] h-[40px]"
          variant="third"
        >
          キャンセル
        </PrimaryButton>

        <PrimaryButton
          onClick={onConfirm}
          className="w-[80px] h-[40px]"
          variant="danger"
        >
          削除
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
