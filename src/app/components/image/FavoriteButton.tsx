//お気に入りボタン動作,表示　まわり

'use client';

import { Heart } from 'lucide-react';
import Image from 'next/image';

type Props = {
  recipeId: string;
  isFavorite: boolean;
  onToggle: (id: string, current: boolean) => void;
};

const FavoriteButton = ({ recipeId, isFavorite, onToggle }: Props) => {
  return (
    <button
      //①押されたらここがまず発火。
      onClick={(e) => {
        e.preventDefault(); //Linkの遷移防止
        onToggle(recipeId, isFavorite); //レシピID,isFav→今の状態
        //→②ここの状態が親に渡される
      }}
    >
      <div className="bg-black/10 backdrop-blur-sm rounded-full p-1 shadow-sm flex items-center justify-center">
        {isFavorite ? (
          <Heart size={24} color="#ff5b99" fill="#ff5b99" />
        ) : (
          <Heart size={24} color="#ffffff" />
        )}
      </div>
    </button>
  );
};
export default FavoriteButton;
