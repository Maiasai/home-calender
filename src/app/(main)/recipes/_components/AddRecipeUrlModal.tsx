//レシピ登録モーダル（URLから）

'use client';

import Image from 'next/image';
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

type Props = {
  onClose: () => void;
  step: RecipeModalStep;
};

const AddRecipeUrlModal = ({ onClose, step }: Props) => {
  const [category, setCategory] = useState<RecipeCategory | ''>('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<CreateRecipeByUrlRequest>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      sourceUrl: '',
      memo: '',
    },
  });

  const onSubmit = async (data: CreateRecipeByUrlRequest) => {
    setLoading(true);

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
        },
        body: JSON.stringify(payload),
      });

      const recipe = await res.json();
      router.push(`/recipes/${recipe.id}`);

      onClose();
      setCategory('');
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 w-full max-w-[900px] max-h-[80vh] overflow-y-auto">
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center md:h-[180px] h-[190px] bg-white m-5 p-4 rounded-lg">
            {/* タイトル */}
            <div className="w-full">
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
          <div className="flex items-center h-[140px] gap-6 bg-white m-5 p-4 rounded-lg">
            <MemoForm registerMemo={register} />
          </div>

          <div className="flex justify-center mb-6">
            <button
              type="submit" //このボタンが押されたらフォームを送信する
              disabled={!isValid || isSubmitting} //バリデーション表示,送信中はtureになる→true時はボタン無効
              className={`w-[160px] h-[30px] rounded-lg bg-orange-500 text-white font-medium shadow-md transition-all duration-150 active:scale-95 active:translate-y-[1px] ${!isValid || isSubmitting ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-orange-600'}`}
            >
              レシピを登録する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeUrlModal;
