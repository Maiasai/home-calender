//レシピ編集画面

'use client';

import { supabase } from '@/_libs/supabase';
import BackIcon from '@/app/_components/image/backicon';
import { RecipeFormValues } from '@/app/_components/recipe/_types/RecipeFormValues';
import { RecipeIngredient } from '@/app/_components/recipe/_types/Ingredient/RecipeIngredient';
import CategorySelector from '@/app/_components/recipe/components/CategorySelector';
import ImageUpload from '@/app/_components/recipe/components/ImageUpload';
import IngredientList from '@/app/_components/recipe/components/IngredientList';
import MemoForm from '@/app/_components/recipe/components/MemoForm';
import StepList from '@/app/_components/recipe/components/StepList';
import TitleForm from '@/app/_components/recipe/components/TitleForm';
import PageTitle from '@/app/_components/recipe/styles/PageTitle';
import { RecipeCategory, Unit } from '@/generated/prisma';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import RecipeUpdateButton from '@/app/_components/image/RecipeUpdateButton';
import { useSupabaseSession } from '../../../_hooks/useSupabaseSession';

type Props = {
  params: { id: string };
};

type PutRecipeRequest = RecipeFormValues & {
  id: string;
  category?: RecipeCategory;
  servings: Number;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}-${text}`);
  }
  return res.json();
};

//①ユーザーが画面に入ってきたらRecipeEditコンポーネントが実行
const RecipeEdit = ({ params }: Props) => {
  const { token } = useSupabaseSession();
  const router = useRouter();

  const [category, setCategory] = useState<'' | RecipeCategory>(''); //表示で""（未選択）必要なためユニオン型で記載
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]); //ここで選択肢を管理
  const [loading, setLoading] = useState<boolean>(false);

  //編集ロジックまわり②useFormが初期化
  const {
    register,
    setValue,
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
  const { data, error, isLoading } = useSWR(`/api/recipes/${id}/`, fetcher);
  //④DBから取得したレシピの初期値をセット
  const recipe = data;

  //④useSWRが発火して画面再描画後、ここでuseEffect材料の量単位を取得
  useEffect(() => {
    const fetchUnits = async () => {
      const res = await fetch('/api/units');
      const data = await res.json();
      setUnits(data);
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
        memo: recipe.memo,
        servings: recipe.servings,
        thumbnailImageUrl: recipe.thumbnailUrl,
        ingredients: recipe.recipeIngredients.map((ing: RecipeIngredient) => ({
          name: ing.ingredient.name,
          amount: ing.quantityText ?? '',
          unitId: String(ing.unit.id ?? ''), //単位の初期選択値
        })),
        steps: recipe.recipeSteps.map((stp: any) => ({
          recipestep: stp.instructionText,
        })),
      });
      setPreviewUrl(recipe.thumbnailUrl); // ←ここでsetPreviewURLも更新
      setCategory(recipe.category); // カテゴリも state にセット
    }
  }, [recipe, reset]);

  //レシピ更新
  const onSubmit = async (data: RecipeFormValues) => {
    setLoading(true); //フォーム送信中

    //useStateとuseFormの値をsubmit時にpayloadで合体
    const payload: PutRecipeRequest = {
      id: recipe.id, //編集の場合はどのレシピを更新するのかどうか指定が必要
      ...data, //useFormが管理しているフォームに入力された値
      category: category || undefined,
      servings: Number(data.servings), // 念のため明示的に数値化
    };
    const result = await supabase.auth.getSession();

    try {
      const res = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'PUT',
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
      alert('レシピを更新しました！');
      router.push(`/home/recipes/${recipe.id}`); //成功したら詳細に戻る
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  //戻るボタン
  const handleBack = () => {
    if (isDirty) {
      const ok = confirm('変更が破棄されますがよろしいですか？');
      if (!ok) return;
    }
    router.push('/home/recipes');
  };

  if (error) return <p>エラーが発生しました</p>;
  if (isLoading) return <p>読み込み中...</p>; //API から recipe を取得中の状態
  if (!data) return <p>データが見つかりませんでした</p>;

  return (
    <div className="max-w-xl mx-auto px-4 gap-2 pb-24">
      {/* ページタイトル */}
      <PageTitle>レシピ編集</PageTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-4">
          <div className="mb-6">
            <button type="button" onClick={handleBack}>
              <BackIcon />
            </button>
          </div>

          <button
            type="submit" //このボタンが押されたらフォームを送信する
            //|| → どちらかが true ならボタンは disabled
            disabled={!isValid || isSubmitting} // バリデーションエラーあり or 送信中なら押せない
            className={`transition${
              !isValid || isSubmitting
                ? 'opacity-50 grayscale cursor-not-allowed'
                : ''
            }`} //バリデーションエラーあり OR 送信中ならグレーアウト
          >
            <RecipeUpdateButton />
          </button>
        </div>

        <div className="max-w-lg mx-auto">
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
              control={control} //{}内が親から渡すもの、左はprops名
              register={register}
              registerServings={register}
              errors={errors}
              setValue={setValue}
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
        </div>
      </form>
    </div>
  );
};

export default RecipeEdit;
