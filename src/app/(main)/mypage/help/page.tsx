//マイページ＞ヘルプ

'use client';

import Image from 'next/image';
import { useState } from 'react';
import RecipeGuide from './_components/RecipeGuide';
import GroupGuide from './_components/GroupGuide';

const Help = () => {
  const [isMenuHelpOpen, setIsMenuHelpOpen] = useState(false);
  const [isGroupHelpOpen, setIsGroupHelpOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

        {isMenuHelpOpen && <RecipeGuide setSelectedImage={setSelectedImage} />}

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

        {isGroupHelpOpen && <GroupGuide setSelectedImage={setSelectedImage} />}
      </section>
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Image
            src={selectedImage}
            alt="拡大画像"
            width={500}
            height={250}
            className="max-h-[90vh] max-w-full rounded-lg bg-white"
          />
        </div>
      )}
    </div>
  );
};

export default Help;
