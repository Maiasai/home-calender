//栄養チェックメッセージ変換用

import { BalanceLevel } from './typs';

type NutritionMessage = {
  title: string;
  comment: string;
};

type NutritionMessageMap = {
  [key in BalanceLevel]: NutritionMessage;
};

export const NutritionMessages: {
  overall: NutritionMessageMap;
  protein: NutritionMessageMap;
  vegetable: NutritionMessageMap;
} = {
  overall: {
    good: {
      title: '◎ いい感じ！',
      comment: '※ 食事のバランスが比較的整っています',
    },

    warning: {
      title: '△ ちょい不足',
      comment: '※ 一部の栄養が少し不足しているかもしれません',
    },

    bad: {
      title: '× 足りないかも',
      comment: '※ 栄養バランスが偏っている可能性があります',
    },
  },

  protein: {
    good: {
      title: '◎ いい感じ！',
      comment: '※ 筋肉や体づくりに必要な栄養を摂れています',
    },

    warning: {
      title: '△ ちょい不足',
      comment: '※ 肉・魚・卵・大豆製品を少し足すとより良いかも',
    },

    bad: {
      title: '× 足りないかも',
      comment: '※ 肉・魚・豆腐・卵などを意識して取り入れると◎',
    },
  },

  vegetable: {
    good: {
      title: '◎ いい感じ！',
      comment: '※ 野菜がしっかり取れています',
    },

    warning: {
      title: '△ ちょい不足',
      comment: '※ 汁物や副菜で野菜を補うのもおすすめです',
    },

    bad: {
      title: '× 足りないかも',
      comment: '※ サラダ or 温野菜を一皿追加するとバランスアップ',
    },
  },
};
