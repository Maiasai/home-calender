'use client';

import Image from 'next/image';

type Props = {
  setSelectedImage: (v: string) => void;
};
const RecipeGuide = ({ setSelectedImage }: Props) => {
  //レシピ登録→献立カレンダー登録まで
  const recipeAddImage = '/images/help/help0101.png';
  const recipeAddImage2 = '/images/help/help0102.png';
  const recipeAddImage3 = '/images/help/help0103.png';
  const recipeAddImage4 = '/images/help/help0104.png';
  const recipeAddImage5 = '/images/help/help0105.png';
  const recipeAddImage6 = '/images/help/help0107.png';
  const recipeAddImage7 = '/images/help/help01010.png';
  const recipeAddImage8 = '/images/help/help01011.png';

  return (
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
          <Image
            src={recipeAddImage}
            alt="レシピ一覧画面のレシピ追加ボタン"
            width={500}
            height={250}
            onClick={() => setSelectedImage(recipeAddImage)}
          />
        </div>
        <ol
          start={3}
          className="list-decimal list-inside space-y-3 text-sm md:text-base leading-7 mt-5"
        >
          <li>レシピの登録方法を選択する</li>
          <Image
            src={recipeAddImage2}
            alt="レシピの登録方法を選択する"
            width={500}
            height={250}
            onClick={() => setSelectedImage(recipeAddImage2)}
          />

          <li>
            必要な情報を入力してレシピを保存する
            <div className="mt-2 ml-2 space-y-1 text-xs md:text-sm text-gray-500">
              <p>
                ※URL登録では、レシピサイトのURLを保存できます。
                著作権保護のため、材料や手順などの内容は自動で反映されません。
              </p>
              <Image
                src={recipeAddImage3}
                alt="URL登録からレシピを登録する"
                width={500}
                height={250}
                onClick={() => setSelectedImage(recipeAddImage3)}
              />
              <p>
                ※オリジナルレシピは、画像とタイトルと人数のみでも登録できます。
                材料や手順は後から自由に追加・編集できます。
              </p>
              <Image
                src={recipeAddImage4}
                alt="URL登録からレシピを登録する"
                width={500}
                height={250}
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
        <Image
          src={recipeAddImage5}
          alt="献立カレンダー画面の献立作成ボタン"
          width={500}
          height={250}
          onClick={() => setSelectedImage(recipeAddImage5)}
        />
        <li>
          献立作成画面で「＋レシピから選択」を押し、
          献立に追加したいレシピを選んで保存する
        </li>{' '}
        <Image
          src={recipeAddImage6}
          alt="レシピを選択して保存する画面"
          width={500}
          height={250}
          onClick={() => setSelectedImage(recipeAddImage6)}
        />
        <li>「カスタマイズ」を押す</li>
        <li>朝・昼・晩いずれかを選択して保存する</li>
        <li>
          最後に「登録」を押すと、献立カレンダーに反映されます。
          <p className="mt-2 ml-2 text-xs md:text-sm text-gray-500">
            ※登録後は、栄養バランスの確認や、献立から買い物リストへの追加ができるようになります。
          </p>
          <Image
            src={recipeAddImage7}
            alt="献立作成画面の登録ボタン"
            width={500}
            height={250}
            onClick={() => setSelectedImage(recipeAddImage7)}
          />
          <Image
            src={recipeAddImage8}
            alt="献立カレンダーに献立が反映された画面"
            width={500}
            height={250}
            onClick={() => setSelectedImage(recipeAddImage8)}
          />
        </li>
      </ol>
    </div>
  );
};
export default RecipeGuide;
