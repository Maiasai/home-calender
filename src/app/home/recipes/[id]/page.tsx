//レシピ詳細画面

'use client'

import BackIcon from "@/app/_components/image/backicon";
import CategoryBadge from "@/app/_components/image/CategoryBadge";
import PageTitle from "@/app/_components/recipe/styles/PageTitle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import RecipeEditButton from "@/app/_components/image/RecipeEditButton";
import RecipeDeleateButton from "@/app/_components/image/RecipeDeleateButton";
import type { RecipeDetail } from "@/app/_components/recipe/_types/Ingredient/RecipeDetail";
//RecipeDetail→typeを自動生成するコンポーネントのため、ここで明示的にtypeとしておく


type Props = {
  params : {id:string}
}

const fetcher = async(url:string)=>{
  const res = await fetch(url)
  if (!res.ok){
    const text = await res.text()
    throw new Error (`HTTP ${res.status}-${text}`)
  }
  return res.json()
}

const RecipeDetail = ({params}:Props) => {
  const {id} = params;
  const { data:recipe , error , isLoading } = useSWR<RecipeDetail>(`/api/recipes/${id}`,fetcher)
  //ここでdata→fetchで取ったデータ
  //error→エラー情報　isLoading→取得中かどうか

  if (isLoading) return <p>読み込み中...</p>//取得してすぐ→"RecipeDetail | undefined" 読み込み中の間にRecipeDetailになる
  if (error) return <p>エラー</p>
  if (!recipe) return <p>データがありません</p>

  console.log("fetchで取得されたデータ",recipe)

  //レシピ削除
  const router = useRouter()
  const deleteRecipe = async (id:string) => {
    await fetch (`/api/recipes/${id}`,{method:"DELETE"})
    router.push("/home/recipes")
  }

  //編集画面へ遷移
  const editRecipe = async(id:string)=>{
    router.push(`/home/recipes/${id}/edit`)//遷移なのでrouter.pushでOK
  }


return(
  <div className="max-w-xl mx-auto pb-24">

    {/* ページタイトル */}
    <PageTitle>レシピ詳細</PageTitle>
    <div>
      <div className="flex justify-between">
        <div>
          <Link href="/home/recipes">
            <BackIcon
            />
          </ Link>
        </div>

          <div className="flex">
            <button
              onClick={()=> {
                if (confirm("本当に削除しますか？")){
                  deleteRecipe(recipe.id)}
              }}
              className="mb-2 mr-2"
            >
              <RecipeDeleateButton/>
            </button>

            <div className="">
              <button
                onClick={(e)=>editRecipe(recipe.id)}
              >
                <RecipeEditButton/>
              </button>
            </div>
          </div>
      </div>
    </div>

    <div className="mx-auto">
      {/* レシピ画像 */}
      <img
        src={recipe.thumbnailUrl??undefined}//
        className="relative w-full border rounded overflow-hidden flex items-center justify-center bg-gray-100"  
      />

      {/* タイトル */}
      <nav
        className="w-full"
      >
        {recipe.title}
      </nav>

      {/* カテゴリと最終更新日 */}
      <div className="flex justify-between">
        <label>
        <CategoryBadge
         category={recipe.category}
         />
        </label>

        <label>
          最終更新日： 
          {new Date(recipe.updatedAt).toLocaleDateString('ja-JP')}
        </label>
      </div>

      
      <div className="flex flex-col space-y-10 mt-10">
        {/* 材料 */}
        <div className="mb-4">
        <div>
          <h2 className="text-lg font-semibold">
            材料
          </h2>
        </div>
        
          <h3 className="text-base font-semibold">
            {recipe.servings}人分
          </h3>

          {/* 材料名  ※li使う場合はulで囲う */}
          <ul>
          {recipe.recipeIngredients.map((ingredientdata) =>(
          <li
            key={ingredientdata.id}
          >
          {/* 材料名 */}
          <div className="flex items-center justify-between py-1 px-2 border-b">
            <div className="w-1/2">
              {ingredientdata.ingredient.name} 

            </div>

          {/* 量と単位 */}
            <div className="w-1/2">
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
          <h2 className="text-lg font-semibold">
            作り方
          </h2>

          {/* 作り方内容 */}
          <ul>
            {recipe.recipeSteps.map( recipestep =>(
            <li
              key={recipestep.id}
            >
              <div className="flex py-1 px-2 border-b">
                <div className="mr-2">
                  {recipestep.stepNumber}
                  </div>
                  {recipestep.instructionText}
              </div>
            </li>
          ))}
          </ul>
        </div>

        {/* 作り方 */}
        <div>
          <h2 className="text-lg font-semibold">
            メモ
          </h2>
          <p className="border-b">
            {recipe.memo}
          </p>
        </div>
      </div>
    </div>
  </div>
)
}

export default RecipeDetail;