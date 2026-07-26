//作ったものボタン動作まわり（イベント発火）

'use client';

import { Bookmark } from 'lucide-react';

type Props = {
  recipeId: string;
  isCooked: boolean;
  onToggle: (id: string, current: boolean) => void;
};

const CookedButton = ({ recipeId, isCooked, onToggle }: Props) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault(); //Linkの遷移防止
        onToggle(recipeId, isCooked); //レシピID,isFav→今の状態
      }}
    >
      <div className="bg-black/10 backdrop-blur-sm rounded-full p-1 shadow-sm flex items-center justify-center">
        {isCooked ? (
          <Bookmark size={24} color="#fecb3e" fill="#fecb3e" />
        ) : (
          <Bookmark size={24} color="#ffffff" />
        )}
      </div>
    </button>
  );
};
export default CookedButton;
