//ダイアログ

'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
};

const Modal = ({ open, onOpenChange, title, children }: Props) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {/* モーダルを通常のHTMLの場所ではなく、画面全体に重ねやすい場所に表示する仕組み。 */}
      <Dialog.Portal>
        {/* 背景の黒い半透明部分。 */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />

        {/* ダイアログ本体 */}
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg z-50">
          <Dialog.Title className="text-lg font-bold mb-4">
            {title}
          </Dialog.Title>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
