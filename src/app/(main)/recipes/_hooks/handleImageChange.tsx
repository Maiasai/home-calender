//画像箇所　hook

import { UseFormSetValue } from 'react-hook-form';
import { RecipeFormValues } from '../_types/RecipeFormValues';
import { convertHeicToJpeg } from '@/lib/convertHeicToJpeg';

//画像が選ばれた→supabaseにUP→その結果をreact-hook-formに反映

type Props = {
  event: React.ChangeEvent<HTMLInputElement>;
  setValue: UseFormSetValue<RecipeFormValues>;
  setPreviewUrl: (url: string | null) => void;
};

const handleImageChange = async ({ event, setValue, setPreviewUrl }: Props) => {
  //①ファイルを取り出す
  if (!event.target.files || event.target.files.length === 0) {
    //event.target.filesが存在しないか、ファイル数0の場合はreturn
    return;
  }

  const originalFile = event.target.files?.[0]; //ユーザーが選択したファイルを取得
  if (!originalFile) return;

  try {
    const file = await convertHeicToJpeg(originalFile);

    //選択直後プレビュー
    const preview = URL.createObjectURL(file);

    setPreviewUrl(preview);

    //③formの値を管理
    setValue('thumbnailFile', file); //useFormの中の thumbnailFileに　ファイルそのもの（IMG_001.jpg）が保存される
  } catch (error) {
    console.error('画像変換失敗', error);

    alert(
      '選択した画像を読み込めませんでした。\n\niPhoneをご利用の場合は、「設定 > カメラ > フォーマット > 互換性優先」に変更して撮影した画像をお試しください。',
    );

    return;
  }
};

export default handleImageChange;
