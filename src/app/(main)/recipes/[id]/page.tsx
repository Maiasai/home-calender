//レシピ詳細画面

'use client';

import BackIcon from '@/app/components/image/backicon';
import CategoryBadge from '@/app/components/image/CategoryBadge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import RecipeEditButton from '@/app/components/image/RecipeEditButton';
import RecipeDeleateButton from '@/app/components/image/RecipeDeleateButton';
import Image from 'next/image';
import PageTitle from '../styles/PageTitle';
import type { RecipeDetail } from '../_types/RecipeDetail';
import { fetcher } from '@/lib/featcher';
//RecipeDetail→typeを自動生成するコンポーネントのため、ここで明示的にtypeとしておく

type Props = {
  params: { id: string };
};

const RecipeDetail = ({ params }: Props) => {
  const { id } = params;
  const router = useRouter();

  const {
    data: recipe,
    error,
    isLoading,
  } = useSWR<RecipeDetail>(`/api/recipes/${id}`, fetcher);
  //ここでdata→fetchで取ったデータ
  //error→エラー情報　isLoading→取得中かどうか

  if (isLoading) return <p>読み込み中...</p>; //取得してすぐ→"RecipeDetail | undefined" 読み込み中の間にRecipeDetailになる
  if (error) return <p>エラー</p>;
  if (!recipe) return <p>データがありません</p>;

  const imageSrc =
    recipe.thumbnailUrl && recipe.thumbnailUrl.trim() !== ''
      ? recipe.thumbnailUrl
      : '/images/noImage.jpg';

  //レシピ削除
  const deleteRecipe = async (id: string) => {
    await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
    router.push('/recipes');
  };

  //編集画面へ遷移
  const editRecipe = async (id: string) => {
    router.push(`/recipes/${id}/edit`); //遷移なのでrouter.pushでOK
  };

  return (
    <div className="flex flex-col max-w-xl mx-auto pb-24">
      {/* ページタイトル */}
      <PageTitle>レシピ詳細</PageTitle>

      <div className="flex justify-between w-full">
        <div className="ml-2">
          <Link href="/recipes">
            <BackIcon />
          </Link>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              if (confirm('本当に削除しますか？')) {
                deleteRecipe(recipe.id);
              }
            }}
            className="mb-2 mr-2"
          >
            <RecipeDeleateButton />
          </button>

          <div className="mr-2">
            <button onClick={(e) => editRecipe(recipe.id)}>
              <RecipeEditButton />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full">
        {/* レシピ画像 */}
        <div className="w-full aspect-[4/3] relative">
          <Image
            className="object-cover rounded-2xl"
            alt="レシピ画像"
            src={imageSrc}
            fill
          />
        </div>

        {/* タイトル */}
        <nav className="w-full text-xl mt-3 font-semibold">{recipe.title}</nav>

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
              <h2 className="text-lg font-semibold mb-3">材料</h2>
            </div>

            <h3 className="text-base font-semibold mb-3">
              {recipe.servings}人分
            </h3>

            {/* 材料名  ※li使う場合はulで囲う */}
            <ul>
              {recipe.recipeIngredients.map((ingredientdata) => (
                <li key={ingredientdata.id}>
                  {/* 材料名 */}
                  <div className="flex items-center py-1 px-2 gap-4">
                    <div className="border-b w-3/4">
                      {ingredientdata.ingredient.name}
                    </div>

                    {/* 量と単位 */}
                    <div className="border-b w-1/4">
                      {ingredientdata.quantityText}
                      {ingredientdata.unit.name}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 作り方 */}
          <div>
            <h2 className="text-lg font-semibold">作り方</h2>

            {/* 作り方内容 */}
            <ul>
              {recipe.recipeSteps.map((recipestep) => (
                <li key={recipestep.id}>
                  <div className="flex py-1 px-2 border-b">
                    <div className="mr-2">{recipestep.stepNumber}</div>
                    {recipestep.instructionText}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* メモ */}
          <div>
            <h2 className="text-lg font-semibold pb-5">メモ</h2>
            <p className="border-b">{recipe.memo}</p>
          </div>
        </div>

        {/* hrefは→ string | undefinedしか許さないため、return前でreturn nullを実施*/}
        <div className="flex justify-center">
          {recipe.sourceType === 'URL' && recipe.sourceUrl && (
            <a href={recipe.sourceUrl} target="_blank">
              <Image
                src="/images/recipesiteopen.png"
                alt="レシピサイトを開く"
                width={159}
                height={34}
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
