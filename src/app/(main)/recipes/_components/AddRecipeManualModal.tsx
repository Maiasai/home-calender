//レシピ登録モーダル（オリジナルレシピを入力）
'use client';

import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import IngredientList from './IngredientList';
import StepList from './StepList';
import ImageUpload from './ImageUpload';
import TitleForm from './TitleForm';
import MemoForm from './MemoForm';
import CategorySelector from './CategorySelector';
import { RecipeCategory } from '@/generated/prisma';
import { useSupabaseSession } from '../../home/_hooks/useSupabaseSession';
import { RecipeFormValues } from '../_types/RecipeFormValues';
import { RecipeModalStep } from '../_types/RecipeModalStep';
import { GetUnitsResponse, UnitData } from '@/app/api/units/route';
import { RecipeData } from '../_types/RecipeTypes';
import { KeyedMutator } from 'swr';
import PrimaryButton from '@/components/button/PrimaryButton';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { mutate as globalMutate } from 'swr';

type Props = {
  onClose: () => void;
  step: RecipeModalStep;
  mutate?: KeyedMutator<RecipeData[]>;
};

type CreateRecipeRequest = RecipeFormValues & {
  servings?: number;
  category?: RecipeCategory;
};

const AddRecipeManualModal = ({ onClose, step, mutate }: Props) => {
  const { token } = useSupabaseSession();

  const [category, setCategory] = useState<RecipeCategory | ''>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [units, setUnits] = useState<UnitData[]>([]); //ここで選択肢を管理

  const {
    register,
    setValue,
    getValues,
    trigger,
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
          cacheControl: '3600',
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

    //useStateとuseFormの値をsubmit時にpayloadで合体
    const payload: CreateRecipeRequest = {
      ...data, //useFormの値(フォームに入力された値)
      thumbnailImageUrl,
      category: category || undefined,
      servings: data.servings ? Number(data.servings) : undefined, // 念のため明示的に数値化
    };
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        credentials: 'include', // cookie を送る
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        //HTTPステータスコードが200-299の時trueになる
        const errorData = await res.json();
        throw new Error(errorData.message || 'レシピ登録に失敗しました');
      }

      //成功だった場合
      alert('レシピを登録しました');
      reset(); //成功したら入力欄をクリア
      await globalMutate(
        (key) => typeof key === 'string' && key.startsWith('/api/recipes'),
      );
      onClose();
      await mutate?.();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('エラーが発生しました');
      }
    }
  };

  return (
    <div className="bg-gray-100 w-full max-w-[800px] max-h-[80vh] overflow-y-auto">
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center flex-col md:flex-row md:h-[250px] h-[340px] gap-6 bg-white m-5 p-4 rounded-lg">
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
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
              trigger={trigger}
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
          <div className="flex items-center h-[200px] gap-6 bg-white m-5 p-4 rounded-lg">
            <MemoForm registerMemo={register} />
          </div>

          <div className="flex justify-center mb-6">
            <PrimaryButton
              type="submit" //このボタンが押されたらフォームを送信する
              disabled={!isValid || isSubmitting} //バリデーション表示,送信中はtureになる→true時はボタン無効
              variant="primary"
              className="w-[160px] h-[30px]"
            >
              {isSubmitting ? 'レシピ登録中' : 'レシピを登録する'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeManualModal;
