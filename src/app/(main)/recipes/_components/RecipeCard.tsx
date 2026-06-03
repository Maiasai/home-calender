//レシピカード（レシピ一覧にて表示）
'use client';

import Link from 'next/link';

import { KeyedMutator } from 'swr';
import { RecipeData } from '../_types/RecipeTypes';
import Image from 'next/image';
import FavoriteButton from '@/app/components/image/FavoriteButton';
import CookedButton from '@/app/components/image/CookedButton';
import toggleStatus from '../../home/_hooks/toggleStatus';
import { useSupabaseSession } from '../../home/_hooks/useSupabaseSession';

type Props = {
  recipe: RecipeData;
  isBulkMode: boolean;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  mutate: KeyedMutator<RecipeData[]>; //SWRが用意した型（そのデータを更新できる mutate 関数）
};

const RecipeCard = ({
  recipe,
  isBulkMode,
  selectedIds,
  setSelectedIds,
  mutate,
}: Props) => {
  const { token } = useSupabaseSession();

  //親からmapしてきたものがここに入る。
  //ここで「このレシピはお気に入り/作ったことある済みか？」を true / false に変換している
  //　※　!!undefinedは「false」にしてる
  const isFav = !!recipe.userRecipeStatus?.[0]?.isFavorite; //!!→返ってくるものをbooleanに変換できる。undefinedの可能性もあるため、ここでfalseにしてる
  const isCoo = !!recipe.userRecipeStatus?.[0]?.hasCooked;

  const imageSrc =
    recipe.thumbnailUrl && recipe.thumbnailUrl.trim() !== ''
      ? recipe.thumbnailUrl
      : '/images/noImage.jpg';

  return (
    <div className="relative mb-8">
      {isBulkMode && (
        <input
          type="checkbox"
          className="absolute sm:top-4 sm:left-4 top-2 left-2 z-10 sm:scale-150 rounded-3xl"
          checked={selectedIds.includes(String(recipe.id))}
          onChange={(e) => {
            e.stopPropagation();
            const idStr = String(recipe.id);

            if (e.target.checked) {
              setSelectedIds([...selectedIds, idStr]);
            } else {
              setSelectedIds(selectedIds.filter((id) => id !== idStr));
            }
          }}
        />
      )}

      <Link
        href={`/recipes/${recipe.id}`}
        onClick={(e) => {
          if (isBulkMode) {
            e.preventDefault();

            const idStr = String(recipe.id);

            if (selectedIds.includes(idStr)) {
              setSelectedIds(selectedIds.filter((id) => id !== idStr));
            } else {
              setSelectedIds([...selectedIds, idStr]);
            }
          }
        }}
        className={`block ${
          selectedIds.includes(String(recipe.id)) ? 'opacity-60' : ''
        }`}
      >
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={imageSrc}
            alt="レシピ画像ない場合の画像"
            fill //Image が親の箱いっぱいに広がる
            className="object-cover"
          />

          <div className="absolute flex gap-x-2 md:top-4 md:right-4 top-1 right-1">
            <FavoriteButton
              recipeId={recipe.id}
              isFavorite={isFav}
              onToggle={(id, current) =>
                //③FavoriteButtonからきた「recipeId,isFavorite」が「id, current」に入って
                //toggleStatusが実行
                toggleStatus(id, current, 'isFavorite', mutate, token)
              }
            />

            <CookedButton
              recipeId={recipe.id}
              isCooked={isCoo}
              onToggle={() =>
                //toggleStatusがDB更新を担当
                toggleStatus(recipe.id, isCoo, 'hasCooked', mutate, token)
              }
            />
          </div>
        </div>

        <div className="flex  md:text-base text-sm mt-1 ml-2">
          {recipe.title}
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;
