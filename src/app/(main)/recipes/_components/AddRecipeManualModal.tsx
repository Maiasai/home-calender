//レシピ登録モーダル（オリジナルレシピを入力）
'use client';

import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import IngredientList from './IngredientList';
import StepList from './StepList';
import ImageUpload from './ImageUpload';
import TitleForm from './TitleForm';
import MemoForm from './MemoForm';
import CategorySelector from './CategorySelector';
import { RecipeCategory } from '@/generated/prisma';
import Image from 'next/image';
import { useSupabaseSession } from '../../home/_hooks/useSupabaseSession';
import { RecipeFormValues } from '../_types/RecipeFormValues';
import { RecipeModalStep } from '../_types/RecipeModalStep';
import { GetUnitsResponse, UnitData } from '@/app/api/units/route';
import { RecipeData } from '../_types/RecipeTypes';
import { KeyedMutator } from 'swr';

type Props = {
  onClose: () => void;
  step: RecipeModalStep;
  mutate: KeyedMutator<RecipeData[]>;
};

type CreateRecipeRequest = RecipeFormValues & {
  servings: number;
  category?: RecipeCategory;
};

const AddRecipeManualModal = ({ onClose, step, mutate }: Props) => {
  const { token } = useSupabaseSession();

  const [category, setCategory] = useState<RecipeCategory | ''>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [units, setUnits] = useState<UnitData[]>([]); //ここで選択肢を管理
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<RecipeFormValues>({
    //ここにunitは入力フォームではないから不要
    mode: 'onChange', //inputの値が変わると発火→RHFが値を検証→formState.isValid 更新　※isValidをリアルタイムで使う時だけ必要。
    defaultValues: {
      title: '',
      memo: '',
      servings: undefined,
      thumbnailImageUrl: '',

      ingredients: [
        {
          name: '',
          amount: undefined,
          unitId: '', //材料入力欄を１つ表示するためのもの
        },
      ],

      steps: [{ recipestep: '' }],
    },
  });

  //append / remove で配列を増減.fields で現在の数を把握
  const { fields, append, remove } = useFieldArray({
    //配列フォームをRHFで管理する仕組み
    control,
    name: 'steps', //フォームのどの配列か指定
  });

  //材料の量単位を取得
  useEffect(() => {
    const fetchUnits = async () => {
      const res = await fetch('/api/units');
      const data: GetUnitsResponse = await res.json();
      setUnits(data.units);
    };
    fetchUnits();
  }, []); //[]の意味：画面が初回表示された時だけ実行

  const onSubmit = async (data: RecipeFormValues) => {
    setLoading(true);

    //useStateとuseFormの値をsubmit時にpayloadで合体
    const payload: CreateRecipeRequest = {
      ...data, //useFormの値(フォームに入力された値)
      category: category || undefined,
      servings: Number(data.servings), // 念のため明示的に数値化
    };
    const result = await supabase.auth.getSession();

    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        credentials: 'include', // cookie を送る
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        //HTTPステータスコードが200-299の時trueになる
        const text = await res.text();
        throw new Error(`HTTP ${res.status}-${text}`);
      }

      //成功だった場合
      const d = await res.json();
      alert('レシピを登録しました！');
      reset(); //成功したら入力欄をクリア

      await mutate();
      setPreviewUrl('');
      setCategory('');
      onClose();
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 w-[600px] max-h-[80vh] overflow-y-auto">
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center h-[250px] gap-6 bg-white m-5 p-4 rounded-lg">
            {/* 画像 */}
            <ImageUpload
              control={control}
              setValue={setValue}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
            />

            {/* タイトル (必須)*/}
            <TitleForm registerTitle={register} errors={errors} step={step} />
          </div>

          {/* カテゴリ */}
          <div className="flex items-center h-[80px] gap-6 bg-white m-5 p-4 rounded-lg">
            <CategorySelector category={category} setCategory={setCategory} />
          </div>

          {/* 人数・材料 (必須)*/}
          <div className="flex items-center gap-6 bg-white m-5 p-4 rounded-lg">
            <IngredientList
              control={control} //{}内が親から渡すもの、左はprops名
              register={register}
              registerServings={register}
              errors={errors}
              setValue={setValue}
              units={units}
            />
          </div>

          {/* 手順 (必須) */}
          <div className="flex items-center gap-6 bg-white m-5 p-4 rounded-lg">
            <StepList
              fields={fields}
              append={append}
              remove={remove}
              register={register}
              errors={errors}
            />
          </div>

          {/* メモ */}
          <div className="flex items-center h-[150px] gap-6 bg-white m-5 p-4 rounded-lg">
            <MemoForm registerMemo={register} />
          </div>

          <div className="flex justify-center mb-6">
            <button
              type="submit" //このボタンが押されたらフォームを送信する
              disabled={!isValid || isSubmitting} //バリデーション表示,送信中はtureになる→true時はボタン無効
              className={`transition${
                !isValid || isSubmitting
                  ? 'opacity-50 grayscale cursor-not-allowed'
                  : ''
              }`}
            >
              <Image
                src="/images/recipecreate.png"
                alt="レシピを登録する"
                width={160}
                height={40}
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeManualModal;
