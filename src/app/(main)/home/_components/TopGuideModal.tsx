//初回表示モーダル

'use client';

import CloseButton from '@/app/components/image/CloseButton';
import Image from 'next/image';

type Props = {
  onClose: () => void;
  dontShowAgain: boolean;
  setDontShowAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

const TopGuideModal = ({ onClose, dontShowAgain, setDontShowAgain }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg max-w-[600px] w-[95%] max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-8 pt-4 border-b">
          <h2 className="text-lg font-bold text-center mt-3">はじめての方へ</h2>

          <CloseButton onClose={onClose} />
        </div>

        <div className="p-8">
          <p className="mb-4">まずはレシピを登録してみましょう。</p>

          <div className="bg-orange-50 p-3 rounded mb-4">
            <p className="font-semibold mb-2">パソコンの場合</p>
            <p>
              上部メニューの「レシピ」を開き、 「レシピ追加」から登録できます。
            </p>
          </div>
          <Image
            src="/images/help/guide-pc.png"
            alt="パソコンでのレシピ登録方法"
            width={500}
            height={250}
            className="rounded border mb-2"
          />

          <div className="bg-orange-50 p-3 rounded mb-4">
            <p className="font-semibold mb-2">スマートフォンの場合</p>
            <p>ホーム画面の 「＋レシピを追加」ボタンから 登録できます。</p>
          </div>

          <Image
            src="/images/help/guide-sp.png"
            alt="スマホでのレシピ登録方法"
            width={250}
            height={450}
            className="rounded border mx-auto mb-2"
          />

          <p className="text-sm text-gray-600 mt-2">
            登録したレシピは献立カレンダーや 買い物リストの作成に利用できます。
          </p>

          {/* 次回から表示しない */}

          <label className="flex items-center gap-2 cursor-pointer mt-4">
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

export default TopGuideModal;
