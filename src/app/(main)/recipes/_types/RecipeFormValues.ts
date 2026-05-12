//レシピ登録編集で使用（フォーム専用型定義）
//UI入力用の構造

import { Step } from '../_hooks/useSteps';

export interface RecipeFormValues {
  title: string;
  memo?: string;
  servings?: number;
  thumbnailImageUrl?: string;
  ingredients: {
    name?: string;
    amount?: number; //DB では小数で保存されるが、TS では number として扱うだけでOK
    unitId?: string;
  }[];

  steps: Step[];
  sourceUrl?: string;
}
