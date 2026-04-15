//お気に入りボタン動作まわり

'use client'

import Image from "next/image";

type Props = {
  recipeId:string;
  isFavorite:boolean;
  onToggle:(id:string,current:boolean)=>void;
}

const FavoriteButton = ({ recipeId , isFavorite ,onToggle } : Props) => {
return(
  <button
    onClick={(e)=>{
      e.preventDefault();//Linkの遷移防止
      onToggle(recipeId,isFavorite);//レシピID,isFav→今の状態
    }}
  >
    <div className="bg-black/10 backdrop-blur-sm rounded-full p-1 shadow-md flex items-center justify-center">
      <Image
        src={isFavorite ? "/images/Heart01.png" : "/images/Heart02.png"}
        alt="お気に入り"
        width={20}
        height={20}
        className="object-contain"
      />
    </div>
  </button>
)
}
export default FavoriteButton;