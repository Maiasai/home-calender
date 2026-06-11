//マイページ＞ヘルプ

'use client';

import { useState } from 'react';

const Help = () => {
  const [isMenuHelpOpen, setIsMenuHelpOpen] = useState(false);
  const [isGroupHelpOpen, setIsGroupHelpOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  //レシピ登録→献立カレンダー登録まで
  const recipeAddImage = '/images/help/help0101.png';
  const recipeAddImage2 = '/images/help/help0102.png';
  const recipeAddImage3 = '/images/help/help0103.png';
  const recipeAddImage4 = '/images/help/help0104.png';
  const recipeAddImage5 = '/images/help/help0105.png';
  const recipeAddImage6 = '/images/help/help0107.png';
  const recipeAddImage7 = '/images/help/help01010.png';
  const recipeAddImage8 = '/images/help/help01011.png';

  //グループ招待と参加方法
  const groupImage1 = '/images/help/help0201.png';

  const groupImage2 = '/images/help/help0202.png';

  const groupImage3 = '/images/help/help0203.png';

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex justify-center border-b-2 mb-10">ヘルプ</nav>
      <section className="space-y-6">
        <button
          type="button"
          onClick={() => setIsMenuHelpOpen((prev) => !prev)}
          className="w-full flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm text-left"
        >
          <div>
            <h1 className="text-base md:text-base font-semibold mb-2">
              献立カレンダーに献立を登録する
            </h1>

            <p className="text-sm md:text-sm text-gray-600">
              献立を登録するには、先にレシピの登録が必要です。
            </p>
          </div>
          <span className="ml-4 text-xl">{isMenuHelpOpen ? '−' : '＋'}</span>
        </button>

        {isMenuHelpOpen && (
          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-4 md:p-6 shadow-sm">
              <h2 className="text-base md:text-lg font-semibold mb-4">
                1. レシピを登録する
              </h2>

              <ol className="list-decimal list-inside space-y-3 text-sm md:text-base leading-7">
                <li>
                  ヘッダーの「レシピ」を開く
                  <p className="ml-2 text-xs md:text-sm text-gray-500">
                    ※スマートフォンの場合はメニュー内にあります。
                  </p>
                </li>

                <li>「レシピ追加」を押す</li>
              </ol>

              <div className="mt-5 overflow-hidden rounded-lg border">
                <img
                  src={recipeAddImage}
                  alt="レシピ一覧画面のレシピ追加ボタン"
                  className="w-full h-auto"
                  onClick={() => setSelectedImage(recipeAddImage)}
                />
              </div>
              <ol
                start={3}
                className="list-decimal list-inside space-y-3 text-sm md:text-base leading-7 mt-5"
              >
                <li>レシピの登録方法を選択する</li>
                <img
                  src={recipeAddImage2}
                  alt="レシピの登録方法を選択する"
                  className="w-full h-auto"
                  onClick={() => setSelectedImage(recipeAddImage2)}
                />

                <li>
                  必要な情報を入力してレシピを保存する
                  <div className="mt-2 ml-2 space-y-1 text-xs md:text-sm text-gray-500">
                    <p>
                      ※URL登録では、レシピサイトのURLを保存できます。
                      著作権保護のため、材料や手順などの内容は自動で反映されません。
                    </p>
                    <img
                      src={recipeAddImage3}
                      alt="URL登録からレシピを登録する"
                      className="w-full h-auto"
                      onClick={() => setSelectedImage(recipeAddImage3)}
                    />
                    <p>
                      ※オリジナルレシピは、画像とタイトルと人数のみでも登録できます。
                      材料や手順は後から自由に追加・編集できます。
                    </p>
                    <img
                      src={recipeAddImage4}
                      alt="URL登録からレシピを登録する"
                      className="w-full h-auto"
                      onClick={() => setSelectedImage(recipeAddImage4)}
                    />
                  </div>
                </li>
              </ol>
            </div>

            <h2 className="text-base md:text-lg font-semibold mb-4 mt-8">
              2. 献立カレンダーに登録する
            </h2>

            <ol
              start={5}
              className="list-decimal list-inside space-y-3 text-sm md:text-base leading-7"
            >
              <li>
                献立カレンダーページで、登録したい日付を選択し「献立作成」を押す
              </li>
              <img
                src={recipeAddImage5}
                alt="献立カレンダー画面の献立作成ボタン"
                className="w-full h-auto"
                onClick={() => setSelectedImage(recipeAddImage5)}
              />
              <li>
                献立作成画面で「＋レシピから選択」を押し、
                献立に追加したいレシピを選んで保存する
              </li>{' '}
              <img
                src={recipeAddImage6}
                alt="レシピを選択して保存する画面"
                className="w-full h-auto"
                onClick={() => setSelectedImage(recipeAddImage6)}
              />
              <li>「カスタマイズ」を押す</li>
              <li>朝・昼・晩いずれかを選択して保存する</li>
              <li>
                最後に「登録」を押すと、献立カレンダーに反映されます。
                <p className="mt-2 ml-2 text-xs md:text-sm text-gray-500">
                  ※登録後は、栄養バランスの確認や、献立から買い物リストへの追加ができるようになります。
                </p>
                <img
                  src={recipeAddImage7}
                  alt="献立作成画面の登録ボタン"
                  className="w-full h-auto mb-2"
                  onClick={() => setSelectedImage(recipeAddImage7)}
                />
                <img
                  src={recipeAddImage8}
                  alt="献立カレンダーに献立が反映された画面"
                  className="w-full h-auto"
                  onClick={() => setSelectedImage(recipeAddImage8)}
                />
              </li>
            </ol>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsGroupHelpOpen((prev) => !prev)}
          className="w-full flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm text-left"
        >
          <div>
            <h1 className="text-base md:text-base font-semibold">
              グループへの招待と参加方法
            </h1>

            <p className="mt-2 text-sm md:text-sm text-gray-600">
              家族やメンバーを招待すると、レシピや献立カレンダーを共有できます。
            </p>
          </div>

          <span className="ml-4 text-xl">{isGroupHelpOpen ? '−' : '＋'}</span>
        </button>

        {isGroupHelpOpen && (
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

              <li>「一括招待ボタン」を押す</li>
            </ol>

            <div className="mt-5 overflow-hidden rounded-lg border">
              <img
                src={groupImage1}
                alt="アプリの共有設定画面でメンバーを招待する"
                className="w-full h-auto"
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
                <img
                  src={groupImage2}
                  alt="右上の通知アイコン"
                  className="w-full h-auto"
                  onClick={() => setSelectedImage(groupImage2)}
                />
              </div>

              <li>
                通知一覧で「参加」を押すと、グループへの参加が完了します。
              </li>

              <div className="mt-5 overflow-hidden rounded-lg border">
                <img
                  src={groupImage3}
                  alt="通知一覧の参加ボタン"
                  className="w-full h-auto"
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
        )}
      </section>
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="拡大画像"
            className="max-h-[90vh] max-w-full rounded-lg bg-white"
          />
        </div>
      )}
    </div>
  );
};

export default Help;
