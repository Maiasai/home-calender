//レシピ登録モーダル（URLから）

'use client';

import TitleForm from './TitleForm';
import MemoForm from './MemoForm';
import CategorySelector from './CategorySelector';
import { useState } from 'react';
import { RecipeCategory } from '@/generated/prisma';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { CreateRecipeByUrlRequest } from '../_types/CreateRecipeByUrlRequest';
import { RecipeModalStep } from '../_types/RecipeModalStep';
import UrlForm from './UrlForm';
import { useSupabaseSession } from '../../home/_hooks/useSupabaseSession';
import PrimaryButton from '@/components/button/PrimaryButton';
import { KeyedMutator } from 'swr';
import { RecipeData } from '../_types/RecipeTypes';

type Props = {
  onClose: () => void;
  step: RecipeModalStep;
  mutate: KeyedMutator<RecipeData[]>;
};

const AddRecipeUrlModal = ({ onClose, step, mutate }: Props) => {
  const { token } = useSupabaseSession();

  const [category, setCategory] = useState<RecipeCategory | ''>('');

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateRecipeByUrlRequest>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      sourceUrl: '',
      memo: '',
    },
  });

  const onSubmit = async (data: CreateRecipeByUrlRequest) => {
    const payload: CreateRecipeByUrlRequest = {
      title: data.title,
      sourceUrl: data.sourceUrl,
      category: category || undefined, //未選択なら送らない
      memo: data.memo || undefined,
    };

    try {
      const res = await fetch('/api/recipes/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'レシピ登録に失敗しました');
      }

      router.push(`/recipes/`);

      onClose();
      await mutate();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('エラーが発生しました');
      }
    }
  };

  return (
    <div className="bg-gray-100 w-full max-w-[800px] max-h-[80vh] overflow-y-auto ">
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center md:h-[280px] h-[300px] bg-white m-5 p-4 rounded-lg">
            {/* タイトル */}
            <div className="w-full mb-6">
              <p className="text-xs text-red-400 mb-4 ml-2">
                * マークがついている項目は必須です
              </p>
              <TitleForm registerTitle={register} errors={errors} step={step} />
            </div>
            {/* Url */}
            <div className="w-full">
              <UrlForm registerUrl={register} errors={errors} />
            </div>
          </div>
          <div className="text-sm mx-8">
            ※URLから登録したレシピは著作権保護の観点から、タイトルとURLのみ保存されます。
            編集画面から材料や手順を追加することもできます。
          </div>

          {/* カテゴリ */}
          <div className="flex items-center h-[80px] gap-6 bg-white m-5 p-4 rounded-lg">
            <CategorySelector category={category} setCategory={setCategory} />
          </div>

          {/* メモ */}
          <div className="flex items-center h-[200px] gap-6 bg-white m-5 p-4 rounded-lg">
            <MemoForm registerMemo={register} />
          </div>

          <div className="flex justify-center mb-6">
            <PrimaryButton
              type="submit" //このボタンが押されたらフォームを送信する
              disabled={!isValid || isSubmitting} //バリデーション表示,送信中はtureになる→true時はボタン無効
              className="w-[160px] h-[30px] "
              variant="primary"
            >
              {isSubmitting ? 'レシピ登録中' : 'レシピを登録する'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeUrlModal;
