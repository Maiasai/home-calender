//レシピ編集画面

'use client';

import BackIcon from '@/app/components/image/BackIcon';

import { RecipeCategory } from '@/generated/prisma';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSupabaseSession } from '../../../home/_hooks/useSupabaseSession';
import { RecipeFormValues } from '../../_types/RecipeFormValues';
import PageTitle from '../../styles/PageTitle';
import ImageUpload from '../../_components/ImageUpload';
import TitleForm from '../../_components/TitleForm';
import CategorySelector from '../../_components/CategorySelector';
import IngredientList from '../../_components/IngredientList';
import StepList from '../../_components/StepList';
import MemoForm from '../../_components/MemoForm';
import { RecipeDetail } from '../../_types/RecipeDetail';
import { fetcher } from '@/lib/featcher';
import { GetUnitsResponse, UnitData } from '@/app/api/units/route';
import UrlForm from '../../_components/UrlForm';
import { Loading } from '@/components/Loading';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  params: { id: string };
};

type PutRecipeRequest = RecipeFormValues & {
  id: string;
  category?: RecipeCategory;
  servings: number;
};

//①ユーザーが画面に入ってきたらRecipeEditコンポーネントが実行
const RecipeEdit = ({ params }: Props) => {
  const { token } = useSupabaseSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const date = searchParams.get('date');

  const [category, setCategory] = useState<'' | RecipeCategory>(''); //表示で""（未選択）必要なためユニオン型で記載
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [units, setUnits] = useState<UnitData[]>([]); //ここで選択肢を管理

  //編集ロジックまわり②useFormが初期化
  const {
    register,
    setValue,
    getValues,
    trigger,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty, isSubmitting },
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
      sourceUrl: '',
    },
  });

  //append / remove で配列を増減.fields で現在の数を把握
  const { fields, append, remove } = useFieldArray({
    //配列フォームをRHFで管理する仕組み
    control,
    name: 'steps', //フォームのどの配列か指定
  });

  //③useSWRが発火→画面描画（まだrecipeはundefined）→⑤APIレスポンスが返る
  const { id } = params;
  const { data, error, isLoading } = useSWR<RecipeDetail>(
    `/api/recipes/${id}/`,
    fetcher,
  );
  //④DBから取得したレシピの初期値をセット
  const recipe = data;

  //④useSWRが発火して画面再描画後、ここでuseEffect材料の量単位を取得
  useEffect(() => {
    const fetchUnits = async () => {
      const res = await fetch('/api/units');
      const data: GetUnitsResponse = await res.json();
      setUnits(data.units);
    };
    fetchUnits();
  }, []); //[]の意味：画面が初回表示された時だけ実行

  //⑥recipe取得後発火し、state に登録済みカテゴリが入る(登録済みカテゴリを表示するため)
  useEffect(() => {
    if (recipe) {
      setCategory(recipe.category);
    }
  }, [recipe]);

  //⑦API取得後、ここで初期値が流し込まれる＞React Hook Form内部state更新 & registerされたinputに反映
  useEffect(() => {
    if (recipe) {
      reset({
        title: recipe.title,
        memo: recipe.memo ?? '',
        servings: recipe.servings ?? undefined,
        thumbnailImageUrl: recipe.thumbnailUrl ?? undefined,
        sourceUrl: recipe.sourceUrl ?? '',

        ingredients: recipe.recipeIngredients?.length
          ? recipe.recipeIngredients.map((ing) => ({
              name: ing.ingredient.name ?? '',
              amount: ing.quantityText ? Number(ing.quantityText) : undefined, //条件 ? 条件がtrueのとき : falseのとき
              unitId: ing.unit?.id ?? undefined, //単位の初期選択値
            }))
          : [{ name: '', amount: undefined, unitId: '' }],

        steps: recipe.recipeSteps?.length
          ? recipe.recipeSteps.map((stp) => ({
              recipestep: stp.instructionText ?? '',
            }))
          : [{ recipestep: '' }],
      });
      setPreviewUrl(recipe.thumbnailUrl); // ←ここでsetPreviewURLも更新
      setCategory(recipe.category); // カテゴリも state にセット
    }
  }, [recipe, reset]);

  //レシピ更新
  const onSubmit = async (data: RecipeFormValues) => {
    if (!recipe) return;

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
    const payload: PutRecipeRequest = {
      id: recipe.id, //編集の場合はどのレシピを更新するのかどうか指定が必要
      ...data, //useFormが管理しているフォームに入力された値
      thumbnailImageUrl,
      category: category || undefined,
      servings: Number(data.servings), // 念のため明示的に数値化
    };

    try {
      const res = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'PUT',
        credentials: 'include', // cookie を送る
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        //HTTPステータスコードが200-299の時trueになる
        const text = await res.text();
        throw new Error(`HTTP ${res.status}-${text}`);
      }

      //成功だった場合
      alert('レシピを更新しました！');
      if (from === 'calendar' && date) {
        router.push(`/recipes/${id}?from=calendar&date=${date}`);
      } else if (from === 'calendar') {
        router.push(`/recipes/${id}?from=calendar`);
      } else {
        router.push(`/recipes/${id}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('エラーが発生しました');
      }
    }
  };

  //戻るボタン
  const handleBack = () => {
    if (isDirty) {
      const ok = confirm('変更が破棄されますがよろしいですか？');
      if (!ok) return;
    }
    if (from === 'calendar' && date) {
      router.push(`/recipes/${id}?from=calendar&date=${date}`);
    } else if (from === 'calendar') {
      router.push(`/recipes/${id}?from=calendar`);
    } else {
      router.push(`/recipes/${id}`);
    }
  };

  if (error) return <p>エラーが発生しました</p>;
  if (isLoading) return <Loading />; //API から recipe を取得中の状態
  if (!data) return <p>データが見つかりませんでした</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 gap-2 h-full flex flex-col overflow-hidden">
      {/* ページタイトル */}
      <PageTitle>レシピ編集</PageTitle>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 min-h-0 overflow-hidden"
      >
        <div className="flex justify-between items-center mb-4 shrink-0">
          <button type="button" onClick={handleBack}>
            <BackIcon />
          </button>

          <button
            type="submit" //このボタンが押されたらフォームを送信する
            //|| → どちらかが true ならボタンは disabled
            disabled={!isValid || isSubmitting} // バリデーションエラーあり or 送信中なら押せない
            className={`w-[100px] h-[30px] rounded-lg bg-orange-500 text-white font-medium shadow-md transition-all duration-150 active:scale-95 active:translate-y-[1px] ${!isValid || isSubmitting ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-orange-600'}`} //バリデーションエラーあり OR 送信中ならグレーアウト
          >
            {isSubmitting ? '更新中...' : '更新'}
          </button>
        </div>

        <div className=" mx-auto w-full flex-1 min-h-0 overflow-y-auto overscroll-contain pb-24">
          {/* レシピ画像 */}
          <ImageUpload
            control={control}
            setValue={setValue}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
          />

          <div className="mt-8">
            {/* タイトル */}
            <TitleForm registerTitle={register} errors={errors} />
          </div>

          {/* カテゴリ */}
          <div className="flex justify-between mt-8">
            <CategorySelector category={category} setCategory={setCategory} />
          </div>

          <div className="flex flex-col space-y-10 mt-10">
            {/* 人数・材料 (必須)*/}
            <IngredientList
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
              trigger={trigger}
              units={units}
            />

            {/* 手順 (必須) */}
            <StepList
              fields={fields}
              append={append}
              remove={remove}
              register={register}
              errors={errors}
            />
          </div>

          <div className="mt-8">
            {/* メモ */}
            <MemoForm registerMemo={register} />
          </div>

          {recipe?.sourceUrl && (
            <div className="mt-8">
              {/*  URLフォーム */}
              <UrlForm registerUrl={register} errors={errors} />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecipeEdit;
