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
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />

        <Dialog.Content className="fixed left-1/2 top-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow-lg">
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
