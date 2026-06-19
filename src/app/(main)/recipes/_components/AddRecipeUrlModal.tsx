//レシピ登録モーダル（URLから）

'use client';

import TitleForm from './TitleForm';
import MemoForm from './MemoForm';
import CategorySelector from './CategorySelector';
import { useEffect, useState } from 'react';
import { RecipeCategory } from '@/generated/prisma';
import {
  Control,
  FieldErrors,
  useForm,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form';
import { CreateRecipeByUrlRequest } from '../_types/CreateRecipeByUrlRequest';
import { RecipeModalStep } from '../_types/RecipeModalStep';
import UrlForm from './UrlForm';
import { useSupabaseSession } from '../../home/_hooks/useSupabaseSession';
import PrimaryButton from '@/components/button/PrimaryButton';
import { KeyedMutator } from 'swr';
import { RecipeData } from '../_types/RecipeTypes';
import { mutate as globalMutate } from 'swr';
import IngredientList from './IngredientList';
import { GetUnitsResponse, UnitData } from '@/app/api/units/route';
import { RecipeIngredientFormPart } from '../_types/RecipeFormValues';

type Props = {
  onClose: () => void;
  step: RecipeModalStep;
  mutate?: KeyedMutator<RecipeData[]>;
};

const AddRecipeUrlModal = ({ onClose, step, mutate }: Props) => {
  const { token } = useSupabaseSession();

  const [category, setCategory] = useState<RecipeCategory | ''>('');

  const [units, setUnits] = useState<UnitData[]>([]); //ここで選択肢を管理

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateRecipeByUrlRequest>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      sourceUrl: '',

      servings: undefined,
      ingredients: [
        {
          name: '',
          amount: undefined,
          unitId: '',
        },
      ],
      memo: '',
    },
  });

  useEffect(() => {
    const fetchUnits = async () => {
      const res = await fetch('/api/units');
      const data: GetUnitsResponse = await res.json();
      setUnits(data.units);
    };
    fetchUnits();
  }, []);

  const onSubmit = async (data: CreateRecipeByUrlRequest) => {
    const payload: CreateRecipeByUrlRequest = {
      ...data,
      category: category || undefined, //未選択なら送らない\
      servings: data.servings ? Number(data.servings) : undefined,
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

      onClose();
      await mutate?.();
      await globalMutate(
        //keyが文字列かつ、/api/recipesで始まるものだけ再取得
        (key) => typeof key === 'string' && key.startsWith('/api/recipes'),
      );
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
          <div className="flex flex-col items-center md:h-[260px] h-[250px] bg-white m-5 p-4 rounded-lg">
            {/* タイトル */}
            <div className="w-full mb-6">
              <p className="text-xs text-red-400 mb-2 ml-2">
                * マークがついている項目は必須です
              </p>
              <TitleForm registerTitle={register} errors={errors} step={step} />
            </div>
            {/* Url */}
            <div className="w-full">
              <UrlForm registerUrl={register} errors={errors} />
            </div>
          </div>
          <div className="text-sm mx-8 text-gray-600">
            ※URLを入力しても、レシピ本文・材料・手順は自動で取り込まれません。
            必要に応じて材料を手入力できます。
            入力した材料は買い物リストに使用されます。
            また、栄養チェックでは野菜・肉類・卵・豆腐などの入力内容をもとに判定を行います。
          </div>

          {/* カテゴリ */}
          <div className="flex items-center h-[80px] gap-6 bg-white m-5 p-4 rounded-lg">
            <CategorySelector category={category} setCategory={setCategory} />
          </div>

          <div className="flex items-center gap-6 bg-white m-5 p-4 rounded-lg">
            <IngredientList
              control={control as unknown as Control<RecipeIngredientFormPart>}
              register={
                register as unknown as UseFormRegister<RecipeIngredientFormPart>
              }
              registerServings={
                register as unknown as UseFormRegister<RecipeIngredientFormPart>
              }
              errors={errors as FieldErrors<RecipeIngredientFormPart>}
              setValue={
                setValue as unknown as UseFormSetValue<RecipeIngredientFormPart>
              }
              getValues={
                getValues as unknown as UseFormGetValues<RecipeIngredientFormPart>
              }
              trigger={
                trigger as unknown as UseFormTrigger<RecipeIngredientFormPart>
              }
              units={units}
            />
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
