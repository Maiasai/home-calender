'use client';

import Image from 'next/image';

type Props = {
  setSelectedImage: (v: string) => void;
};
const GroupGuide = ({ setSelectedImage }: Props) => {
  //グループ招待と参加方法
  const groupImage1 = '/images/help/help0201.png';
  const groupImage2 = '/images/help/help0202.png';
  const groupImage3 = '/images/help/help0203.png';

  return (
    <div className="rounded-xl border bg-white p-4 md:p-6 shadow-sm">
      <h2 className="text-base md:text-lg font-semibold mb-4">
        1. メンバーを招待する
      </h2>

      <ol className="list-decimal list-inside space-y-3 text-sm md:text-base leading-7">
        <li>
          ヘッダーの「マイページ」を開く
          <p className="ml-2 text-xs md:text-sm text-gray-500">
            ※スマートフォンの場合はメニュー内にあります。
          </p>
        </li>

        <li>「アプリの共有設定」を押す</li>

        <li>同期をONにする</li>

        <li>
          「招待するメンバー」に招待したいメールアドレスを入力する
          <p className="ml-2 text-xs md:text-sm text-gray-500">
            ※招待する相手は、先にアカウント登録が必要です。
          </p>
        </li>

        <li>「招待を送信ボタン」を押す</li>
      </ol>

      <div className="mt-5 overflow-hidden rounded-lg border">
        <Image
          src={groupImage1}
          alt="アプリの共有設定画面でメンバーを招待する"
          width={500}
          height={250}
          onClick={() => setSelectedImage(groupImage1)}
        />
      </div>

      <h2 className="text-base md:text-lg font-semibold mb-4 mt-8">
        2. 招待に参加する
      </h2>

      <ol
        start={2}
        className="list-decimal list-inside space-y-3 text-sm md:text-base leading-7"
      >
        <li>
          招待された側のアカウントでログインし、右上の通知アイコンを押す
          <p className="ml-2 text-xs md:text-sm text-gray-500">
            ※スマートフォンの場合は、メニュー内の「通知一覧」から確認できます。
          </p>
        </li>

        <div className="mt-5 overflow-hidden rounded-lg border">
          <Image
            src={groupImage2}
            alt="右上の通知アイコン"
            width={500}
            height={250}
            onClick={() => setSelectedImage(groupImage2)}
          />
        </div>

        <li>通知一覧で「参加」を押すと、グループへの参加が完了します。</li>

        <div className="mt-5 overflow-hidden rounded-lg border">
          <Image
            src={groupImage3}
            alt="通知一覧の参加ボタン"
            width={500}
            height={250}
            onClick={() => setSelectedImage(groupImage3)}
          />
        </div>
      </ol>

      <div className="mt-8 rounded-lg bg-orange-50 p-4 text-sm md:text-base leading-7">
        <h3 className="font-semibold mb-2">承認後について</h3>

        <p className="mb-2">
          以下のデータは、参加したグループの内容が表示されます。
        </p>

        <ul className="list-disc list-inside space-y-1">
          <li>レシピ</li>

          <li>献立カレンダー</li>

          <li>買い物リスト</li>
        </ul>
      </div>

      <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm md:text-base leading-7">
        <h3 className="font-semibold mb-2">グループを解除した場合</h3>

        <p>
          共有設定から退出できます。
          グループ参加前に所有していたレシピや各種データが再び表示されます。
        </p>
      </div>
    </div>
  );
};
export default GroupGuide;
