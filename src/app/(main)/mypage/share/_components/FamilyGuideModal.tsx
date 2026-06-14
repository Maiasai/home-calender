'use client';

import CloseButton from '@/app/components/image/CloseButton';
import Image from 'next/image';

type Props = {
  onClose: () => void;
  dontShowAgain: boolean;
  setDontShowAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

const FamilyGuideModal = ({
  onClose,
  dontShowAgain,
  setDontShowAgain,
}: Props) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg max-w-[520px] w-[95%] max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-8 pt-4 border-b">
          <h2 className="text-lg font-bold text-center mt-3 mb-4">
            アプリの共有設定について
          </h2>

          <div className="absolute top-4 right-3">
            <CloseButton onClose={onClose} />
          </div>
        </div>

        <div className="p-8">
          <p className="mb-4">
            メンバーを招待すると、レシピ・献立カレンダー・買い物リストを共有できます。
          </p>

          <div className="bg-orange-50 p-4 rounded mb-4 text-sm leading-7">
            <ol className="list-decimal list-inside space-y-2">
              <li>同期をONにする</li>
              <li>招待したい相手のメールアドレスを入力する</li>

              <Image
                src="/images/help/help0201.png"
                alt="メンバー招待画像"
                width={500}
                height={250}
                className="rounded border mb-2"
              />

              <li>招待を送信ボタンを押す</li>
              <li>相手が通知一覧から「参加」を押すと、共有設定が完了します</li>
              <Image
                src="/images/help/help0203.png"
                alt="参加画像"
                width={500}
                height={250}
                className="rounded border mb-2"
              />
            </ol>
          </div>

          <p className="text-sm text-gray-600 ml-2">
            ※招待する相手は、先にアカウント登録が必要です。
          </p>
          <div className="mt-5 rounded-lg bg-gray-50 p-4 text-sm leading-7">
            <h3 className="font-semibold mb-2">参加後について</h3>

            <p>
              共有に参加すると、参加したグループの
              レシピ・献立カレンダー・買い物リストが表示されます。
            </p>
          </div>

          <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm leading-7">
            <h3 className="font-semibold mb-2">グループから抜けた場合</h3>

            <p>
              グループから抜けると、参加前に使っていた自分のデータ表示に戻ります。
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-5">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />

            <span className="text-sm">次回から表示しない</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FamilyGuideModal;
