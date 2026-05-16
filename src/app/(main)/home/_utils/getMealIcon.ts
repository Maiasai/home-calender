//カテゴリアイコン画像

import { UiMealType } from '../_typs/UiMealType';

//UiMealTypeが全部キーとして持つオブジェクトかつ、値はstrigという意味
type IconType = Record<UiMealType, string>;

//(type:UiMealType)でこの関数に渡していい値を制限
export const getMealIcon = (type: UiMealType) => {
  const map: IconType = {
    BREAKFAST: '/images/morningIcon.png',
    LUNCH: '/images/daytimeIcon.png',
    DINNER: '/images/nightIcon.png',
    UNSELECTED: '/images/nullIcon.png',
  };

  //ここでmapの中から引数のtypeを返している
  return map[type];
};
