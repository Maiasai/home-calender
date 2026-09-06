//レシピ登録モーダル（URLから）

'use client';

import TitleForm from './TitleForm';
import MemoForm from './MemoForm';
import CategorySelector from './CategorySelector';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { RecipeCategory } from '@/generated/prisma';
import { useForm } from 'react-hook-form';
import { CreateRecipeByUrlRequest } from '../_types/CreateRecipeByUrlRequest';
import { RecipeModalStep } from '../_types/RecipeModalStep';
import UrlForm from './UrlForm';
import { useSupabaseSession } from '../../home/_hooks/useSupabaseSession';
import PrimaryButton from '@/components/button/PrimaryButton';
import { RecipePageResponse } from '../_types/RecipeTypes';
import { mutate as globalMutate } from 'swr';
import IngredientList from './IngredientList';
import { GetUnitsResponse, UnitData } from '@/app/api/units/route';
import { RecipeFormValues } from '../_types/RecipeFormValues';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import ImageUpload from './ImageUpload';
import { SWRInfiniteKeyedMutator } from 'swr/infinite';

type Props = {
  onClose: () => void;
  step: RecipeModalStep;
  mutate?: SWRInfiniteKeyedMutator<RecipePageResponse[]>;
  previewUrl: string | null;
  setPreviewUrl: Dispatch<SetStateAction<string | null>>;
};

const AddRecipeUrlModal = ({
  onClose,
  step,
  mutate,
  previewUrl,
  setPreviewUrl,
}: Props) => {
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
  } = useForm<RecipeFormValues>({
    mode: 'onChange',
    defaultValues: {
      thumbnailImageUrl: '',
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

  const onSubmit = async (data: RecipeFormValues) => {
    let thumbnailImageUrl = data.thumbnailImageUrl;
    if (data.thumbnailFile) {
      const uuid = uuidv4(); //ランダムな一意なIDを作る関数
      const extension = data.thumbnailFile.name.split('.').pop() || 'jpg';
      const filePath = `private/${uuid}.${extension}`;

      //②supabaseにアップロード（uuid名で保存）
      //uploadDataには保存された場所が入ってくる
      const { data: uploadData, error } = await supabase.storage
        .from('post_thumbnail')
        .upload(filePath, data.thumbnailFile, {
          cacheControl: '31536000', //1年間
          upsert: false,
        });

      //アップロード失敗した場合
      if (error) {
        alert(error.message);
        return;
      }

      //ここで公開URL取得
      const publicUrl = await supabase.storage
        .from('post_thumbnail') //supabage Storageのpost_thumbnailというパケットにあるdata.pathファイルの外部アクセスURLをくださいと指示
        .getPublicUrl(uploadData.path).data.publicUrl;

      thumbnailImageUrl = publicUrl;
    }

    const payload: CreateRecipeByUrlRequest = {
      title: data.title,
      sourceUrl: data.sourceUrl ?? '',
      memo: data.memo,
      ingredients: data.ingredients,
      thumbnailImageUrl,
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
          <div className="flex items-center flex-col md:flex-row md:h-[250px] h-[250px] gap-6 bg-white m-5 p-4 rounded-lg">
            {/* 画像 */}
            <ImageUpload
              control={control}
              setValue={setValue}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
            />
          </div>
          <div className="flex flex-col items-center md:h-[200px] h-[220px] bg-white m-5 p-4 rounded-lg">
            {/* タイトル */}
            <div className="w-full mb-2">
              <TitleForm registerTitle={register} errors={errors} step={step} />
            </div>
            {/* Url */}
            <div className="w-full">
              <UrlForm registerUrl={register} errors={errors} isRequired />
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
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
              trigger={trigger}
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
