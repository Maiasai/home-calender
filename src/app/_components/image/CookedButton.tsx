//作ったものボタン動作まわり（イベント発火）

'use client'

import Image from "next/image";

type Props = {
  recipeId:string;
  isCooked:boolean;
  onToggle:(id:string,current:boolean)=>void;
}

const CookedButton = ({ recipeId , isCooked ,onToggle } : Props) => {
return(
  <button
    onClick={(e)=>{
      e.preventDefault();//Linkの遷移防止
      onToggle(recipeId,isCooked);//レシピID,isFav→今の状態
    }}
  >
    <div className="bg-black/10 backdrop-blur-sm rounded-full p-1 shadow-md flex items-center justify-center">
      <Image
        src={isCooked ? "/images/bookmark01.png" : "/images/bookmark02.png"}
        alt="作ったもの"
        width={20}
        height={20}
        className="object-contain"
      />
    </div>
  </button>
)
}
export default CookedButton;