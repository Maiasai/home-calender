//レシピカード（レシピ一覧にて表示）

import Link from "next/link";
import FavoriteButton from "../../image/FavoriteButton";
import toggleStatus from "@/app/home/hooks/toggleStatus";
import CookedButton from "../../image/CookedButton";
import { KeyedMutator } from "swr";
import { RecipeData } from "../_types/RecipeTypes";


type Props = {
  recipe: RecipeData
  isBulkMode: boolean
  selectedIds: string[]
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
  mutate:  KeyedMutator<RecipeData[]>//SWRが用意した型（そのデータを更新できる mutate 関数）
}

const RecipeCard = ({
  recipe,
  isBulkMode,
  selectedIds,
  setSelectedIds,
  mutate
}:Props) => {

  //isFav→現在のお気に入り状態
  const isFav = !!recipe.userRecipeStatus?.[0]?.isFavorite;//!!→返ってくるものをbooleanに変換できる。undefinedの可能性もあるため、ここでfalseにしてる
  const isCoo = !!recipe.userRecipeStatus?.[0]?.hasCooked;//DBカラムそのもの
  
  return (
    <div className="relative">

      {isBulkMode && (
        <input
          type="checkbox"
          className="absolute top-4 left-4 z-10 scale-150"
          checked={selectedIds.includes(String(recipe.id))}
          onChange={(e)=>{
            e.stopPropagation()
            const idStr = String(recipe.id)

            if (e.target.checked) {
              setSelectedIds([...selectedIds, idStr])
            } else {
              setSelectedIds(
                selectedIds.filter(id => id !== idStr)
              )
            }
          }}
        />
      )}

      <Link
        href={`/home/recipes/${recipe.id}`}
        onClick={(e)=>{
          if(isBulkMode){
            e.preventDefault()

            const idStr = String(recipe.id)

            if(selectedIds.includes(idStr)){
              setSelectedIds(selectedIds.filter(id => id !== idStr))
            }else{
              setSelectedIds([...selectedIds,idStr])
            }
          }
        }}
        className={`block ${
          selectedIds.includes(String(recipe.id)) ? "opacity-60" : ""
        }`}
      >

        <div className="aspect-[4/3] overflow-hidden rounded-lg">
          <img
            src={recipe.thumbnailUrl?? undefined}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-between">
          {recipe.title}

          <div className="flex gap-x-2">

            <FavoriteButton
              recipeId={recipe.id}
              isFavorite={isFav}
              onToggle={() =>
                toggleStatus(recipe.id,isFav,"isFavorite",mutate)
              }
            />

            <CookedButton
              recipeId={recipe.id}
              isCooked={isCoo}
              onToggle={() =>
                toggleStatus(recipe.id,isCoo,"hasCooked",mutate)
              }
            />

          </div>
        </div>

      </Link>

    </div>
  )
}

export default RecipeCard;