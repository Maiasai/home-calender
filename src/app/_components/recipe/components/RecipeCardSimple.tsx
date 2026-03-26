//レシピカード（献立作成モーダルにて表示）
'use client'

import { SelectedRecipe } from "@/app/home/_typs/SelectedRecipe";
import { RecipeData } from "../_types/RecipeTypes";
import Image from "next/image";


type Props = {
  recipe: RecipeData
  selectedRecipes : SelectedRecipe[]
  toggleSelect:(recipe: RecipeData)=>void
}

const RecipeCardSimple = ({
  recipe,
  selectedRecipes,
  toggleSelect
}:Props) => {

  const isSelected = selectedRecipes.some(r => r.id === recipe.id)

  return (
    <div 
      className={`
        cursor-pointer
        ${isSelected  ? 'border-orange-300 border-2 rounded-lg p-0.5' : ''}
      `}
    >
      
      <div 
        className="relative"
        onClick={()=>toggleSelect(recipe)}//選択されたレシピが、オブジェクトで関数に渡される
      >

        <div className="aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={recipe.thumbnailUrl?? undefined}
            alt="レシピ画像"
            className="w-full h-full object-cover rounded-lg"
            width={100}
            height={100}
          />
        </div>

        <div className="flex justify-between">
          {recipe.title}
        </div>

      </div>
    </div>
  )
}

export default RecipeCardSimple;