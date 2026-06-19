//レシピ登録編集で使用（フォーム専用型定義）
//UI入力用の構造

import { Step } from '../_hooks/useSteps';

export type RecipeFormValues = RecipeIngredientFormPart & {
  title: string;
  memo?: string;
  thumbnailImageUrl?: string;
  thumbnailFile?: File | null; //画像ファイルそのもの、または null、または未定義
  steps: Step[];
  sourceUrl?: string;
};

export type RecipeIngredientFormPart = {
  servings?: number;
  ingredients: IngredientFormValue[];
};

export type IngredientFormValue = {
  name?: string;
  amount?: number; //DB では小数で保存されるが、TS では number として扱うだけでOK
  unitId?: string;
};
