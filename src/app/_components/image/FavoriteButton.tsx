//お気に入りボタン動作まわり

'use client'

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
    <img
      src={isFavorite ? "/images/Heart01.png" : "/images/Heart02.png"}
      alt="お気に入り"
      width={20}
    />
  </button>
)
}
export default FavoriteButton;