//カテゴリ絞り込みボタン

import ClassificationButton from "../../image/ClassificationButton";
import { CategoryFilter } from "../_types/CategoryFilter";


type Props = {
  category : CategoryFilter
  setCategory : (v:CategoryFilter) => void
}

const CategoryFilterButtons = ({
  category,
  setCategory
}:Props) => {

  return (
    <div className="flex justify-center mb-10 gap-x-2">
      <ClassificationButton
        isActive={category === ""}//押される→onClick動いてStete更新　→　stateで今選ばれているかここで見る
        onClick={()=>setCategory("")} // 押された時の処理（すべて）
      >
        すべて
      </ClassificationButton>

      <ClassificationButton
        isActive={category === "MAIN"}
        onClick={()=>setCategory("MAIN")} // 主菜
      >
        主菜
      </ClassificationButton>

      <ClassificationButton
        isActive={category === "SIDE"}
        onClick={()=>setCategory("SIDE")} // 副菜
      >
        副菜
      </ClassificationButton>

      <ClassificationButton
        isActive={category === "UNCLASSIFIED"}
        onClick={()=>setCategory("UNCLASSIFIED")} // 未分類
      >
        未分類
      </ClassificationButton>
    </div>
  )
}

export default CategoryFilterButtons;