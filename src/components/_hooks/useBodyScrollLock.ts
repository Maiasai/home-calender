//メニュー開いた時、メニュー外スクロール不可にする

import { useEffect } from 'react';

type Props = {
  open: boolean;
};
export const useBodyScrollLock = ({ open }: Props) => {
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [open]);
};
