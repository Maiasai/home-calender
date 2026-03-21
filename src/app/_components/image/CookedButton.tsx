//作ったものボタン動作まわり（イベント発火）

'use client'

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
    <img
      src={isCooked ? "/images/bookmark01.png" : "/images/bookmark02.png"}
      alt="作ったもの"
      width={20}
    />
  </button>
)
}
export default CookedButton;