//画像箇所　UI
'use client';

import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { useRef } from 'react';
import handleImageChange from '../_hooks/handleImageChange';
import { RecipeFormValues } from '../_types/RecipeFormValues';
import Image from 'next/image';

type Props = {
  control: Control<RecipeFormValues>;
  setValue: UseFormSetValue<RecipeFormValues>;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
};

const ImageUpload = ({
  control,
  setValue,
  previewUrl,
  setPreviewUrl,
}: Props) => {
  //HTMLの<input>要素を直接触るための箱（<input type="file"> を click())
  const fileRef = useRef<HTMLInputElement>(null); //②ここでref を input（ref={fileRef}） に渡す

  const openFile = () => {
    fileRef.current?.click(); //fileRef.current が存在するなら click
  };

  return (
    //Controller→RHFとこのカスタムUIを接続（普通のinputじゃない場合に使用）
    <Controller
      name="thumbnailImageUrl"
      control={control}
      render={() => (
        <div className="flex flex-col">
          <p className="text-xs text-red-400 mb-4">
            * マークがついている項目は必須です
          </p>
          <label className="block mb-2">レシピ画像</label>

          <div
            onClick={openFile} //①画像選択でここが発火
            className="relative w-[200px] h-[150px] border rounded-md overflow-hidden cursor-pointer flex items-center justify-center bg-gray-100"
          >
            {/* 画像 or NoImage */}
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="画像"
                className="w-full h-full object-cover"
                width={100}
                height={100}
              />
            ) : (
              <span className="text-gray-400">画像を選択してください</span>
            )}

            {/* カメラアイコン */}
            <div className="absolute bottom-2 left-2 bg-white rounded-full p-2 shadow">
              <Image
                src="/images/cameraicon.png"
                alt="カメラアイコン"
                width={20}
                height={20}
              />
            </div>
          </div>

          {/* hidden file input */}
          <input
            ref={fileRef} //③ここにrefが来たら→fileRef.current = inputのDOMをReactが自動でやってくれる
            type="file" //④画像押下→ファイル選択ダイアログを出すために②③を経由している
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              //⑤ユーザーがファイル選択した瞬間に動く
              await handleImageChange({ event: e, setValue, setPreviewUrl });
              //⑥画像取得、プレビュー作成、プレビューURL更新
            }}
          />
        </div>
      )}
    />
  );
};

export default ImageUpload;
