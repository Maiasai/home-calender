//レシピ詳細画面

'use client';

import BackIcon from '@/app/components/image/BackIcon';
import CategoryBadge from '@/app/components/image/CategoryBadge';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import Image from 'next/image';
import PageTitle from '../styles/PageTitle';
import type { RecipeDetail } from '../_types/RecipeDetail';
import { fetcher } from '@/lib/featcher';
import PrimaryButton from '@/components/button/PrimaryButton';
import { Loading } from '@/components/Loading';
import { Empty } from '@/components/Empty';
import ErrorMessage from '../_components/ErrorMessage';
import { useSupabaseSession } from '../../home/_hooks/useSupabaseSession';
//RecipeDetail→typeを自動生成するコンポーネントのため、ここで明示的にtypeとしておく

type Props = {
  params: { id: string };
};

const RecipeDetail = ({ params }: Props) => {
  const { token } = useSupabaseSession();
  const { id } = params;
  const router = useRouter();

  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const date = searchParams.get('date');

  const {
    data: recipe,
    error,
    isLoading,
    mutate,
  } = useSWR<RecipeDetail>(`/api/recipes/${id}`, fetcher);
  //ここでdata→fetchで取ったデータ
  //error→エラー情報　isLoading→取得中かどうか

  if (isLoading) return <Loading />;
  if (!recipe) return <Empty />;
  if (error) return <ErrorMessage />;

  const imageSrc =
    recipe.thumbnailUrl && recipe.thumbnailUrl.trim() !== ''
      ? recipe.thumbnailUrl
      : '/images/noImage.jpg';

  //レシピ削除
  const deleteRecipe = async (id: string) => {
    if (!token) return;

    const res = await fetch(`/api/recipes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return;
    }
    mutate();
    router.push('/recipes');
  };

  //編集画面へ遷移
  const editRecipe = async (id: string) => {
    if (from === 'calendar' && date) {
      router.push(`/recipes/${id}/edit?from=calendar&date=${date}`);
    } else if (from === 'calendar') {
      router.push(`/recipes/${id}/edit?from=calendar`);
    } else {
      router.push(`/recipes/${id}/edit`);
    } //遷移なのでrouter.pushでOK
  };

  //戻るボタンの処理
  const handleBack = () => {
    if (from === 'calendar' && date) {
      router.push(`/home?date=${date}`);
    } else if (from === 'calendar') {
      router.push('/home');
    } else {
      router.push('/recipes');
    }
  };

  return (
    <div className="flex flex-col max-w-xl mx-auto p-2 h-full overflow-hidden">
      {/* ページタイトル */}
      <PageTitle>レシピ詳細</PageTitle>

      <div className="flex justify-between w-full shrink-0">
        <div className="ml-2">
          <button onClick={handleBack}>
            <BackIcon />
          </button>
        </div>

        <div className="flex gap-2">
          <PrimaryButton
            onClick={() => {
              if (confirm('本当に削除しますか？')) {
                deleteRecipe(recipe.id);
              }
            }}
            className="w-[100px] h-[30px] mb-2 mr-2"
            variant="danger"
          >
            削除
          </PrimaryButton>

          <div className="mr-2">
            <PrimaryButton
              onClick={() => editRecipe(recipe.id)}
              className="w-[100px] h-[30px]"
              variant="primary"
            >
              編集
            </PrimaryButton>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 min-h-0 overflow-y-auto overscroll-contain pb-24">
        {/* レシピ画像 */}
        <div className="w-full aspect-[4/3] relative">
          <Image
            className="object-cover rounded-2xl"
            alt="レシピ画像"
            src={imageSrc}
            fill
          />
        </div>

        <div className="mx-2">
          {/* タイトル */}
          <nav className="w-full text-xl mt-3 font-semibold">
            {recipe.title}
          </nav>

          {/* カテゴリと最終更新日 */}
          <div className="flex justify-between mt-3">
            <label>
              <CategoryBadge category={recipe.category} />
            </label>

            <label className="flex items-center">
              最終更新日：
              {new Date(recipe.updatedAt).toLocaleDateString('ja-JP')}
            </label>
          </div>

          <div className="flex flex-col space-y-10 mt-10 mb-10">
            {/* 材料 */}
            <div className="mb-4">
              <div>
                <h2 className="text-lg font-semibold mb-4">材料</h2>
              </div>

              <h3 className="text-base font-semibold mb-3 ml-2">
                {recipe.servings}人分
              </h3>

              {/* 材料名  ※li使う場合はulで囲う */}
              <ul>
                {recipe.recipeIngredients.map((ingredientdata) => (
                  <li
                    key={ingredientdata.id}
                    className="flex items-start py-1 px-3 border-b mt-2"
                  >
                    {/* 材料名 */}

                    <div className="w-3/4">
                      {ingredientdata.ingredient.name}
                    </div>

                    {/* 量と単位 */}
                    <div className="w-1/4 text-right shrink-0">
                      {ingredientdata.quantityText}
                      {ingredientdata.unit?.name}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 作り方 */}
            <div>
              <h2 className="text-lg font-semibold mb-4">作り方</h2>

              {/* 作り方内容 */}
              <ul>
                {recipe.recipeSteps.map((recipestep) => (
                  <li key={recipestep.id}>
                    <div className="flex items-start  py-1 px-3 border-b mt-2">
                      <div className="mx-1">{recipestep.stepNumber}</div>
                      {recipestep.instructionText}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* メモ */}
            <div>
              <h2 className="text-lg font-semibold mp-4">メモ</h2>
              <p className="flex items-start  py-1 px-3 border-b mt-6">
                {recipe.memo}
              </p>
            </div>
          </div>

          {/* hrefは→ string | undefinedしか許さないため、return前でreturn nullを実施*/}
          <div className="flex justify-center">
            {recipe.sourceType === 'URL' && recipe.sourceUrl && (
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PrimaryButton className="w-[159px] h-[34px]" variant="primary">
                  レシピサイトを開く
                </PrimaryButton>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
