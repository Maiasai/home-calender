//食材マスタ

import { NutritionCategory, vegetableType } from '@/lib/nutrition/typs';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

type IngredientMaster = {
  name: string;
  normalizedName: string;
  nutritionCategory: NutritionCategory;
  vegetableType?: vegetableType;
  proteinScore?: number;
};

export const ingredientsData: IngredientMaster[] = [
  // タンパク質（肉）（100g換算）
  {
    name: '鶏むね',
    normalizedName: 'とりむね',
    nutritionCategory: 'PROTEIN',
    proteinScore: 19.5,
  },
  {
    name: '鶏もも',
    normalizedName: 'とりもも',
    nutritionCategory: 'PROTEIN',
    proteinScore: 17.3,
  },
  {
    name: 'ささみ',
    normalizedName: 'ささみ',
    nutritionCategory: 'PROTEIN',
    proteinScore: 24.6,
  },
  {
    name: '豚ロース',
    normalizedName: 'ぶたろーす',
    nutritionCategory: 'PROTEIN',
    proteinScore: 22.7,
  },
  {
    name: '豚こま',
    normalizedName: 'ぶたこま',
    nutritionCategory: 'PROTEIN',
    proteinScore: 18.5,
  },
  {
    name: '豚バラ',
    normalizedName: 'ぶたばら',
    nutritionCategory: 'PROTEIN',
    proteinScore: 13.4,
  },
  {
    name: '豚ヒレ',
    normalizedName: 'ぶたひれ',
    nutritionCategory: 'PROTEIN',
    proteinScore: 22.2,
  },

  {
    name: '牛こま',
    normalizedName: 'ぎゅうこま',
    nutritionCategory: 'PROTEIN',
    proteinScore: 17,
  },
  {
    name: '牛もも',
    normalizedName: 'ぎゅうもも',
    nutritionCategory: 'PROTEIN',
    proteinScore: 19.2,
  },
  {
    name: '牛ヒレ',
    normalizedName: 'ぎゅうひれ',
    nutritionCategory: 'PROTEIN',
    proteinScore: 19.1,
  },

  {
    name: '鶏ひき',
    normalizedName: 'とりひき',
    nutritionCategory: 'PROTEIN',
    proteinScore: 17.5,
  },
  {
    name: '豚ひき',
    normalizedName: 'ぶたひき',
    nutritionCategory: 'PROTEIN',
    proteinScore: 17.7,
  },
  {
    name: '合い挽き',
    normalizedName: 'あいびき',
    nutritionCategory: 'PROTEIN',
    proteinScore: 17.3,
  },
  {
    name: 'ひき肉',
    normalizedName: 'ひきにく',
    nutritionCategory: 'PROTEIN',
    proteinScore: 17.5,
  },

  //  魚（100g換算）
  {
    name: '鮭',
    normalizedName: 'さけ',
    nutritionCategory: 'PROTEIN',
    proteinScore: 21.7,
  },
  {
    name: 'サーモン',
    normalizedName: 'さーもん',
    nutritionCategory: 'PROTEIN',
    proteinScore: 20.1,
  },
  {
    name: 'さば',
    normalizedName: 'さば',
    nutritionCategory: 'PROTEIN',
    proteinScore: 20.6,
  },
  {
    name: 'いわし',
    normalizedName: 'いわし',
    nutritionCategory: 'PROTEIN',
    proteinScore: 19.2,
  },
  {
    name: 'まぐろ',
    normalizedName: 'まぐろ',
    nutritionCategory: 'PROTEIN',
    proteinScore: 24.3,
  },
  {
    name: 'ぶり',
    normalizedName: 'ぶり',
    nutritionCategory: 'PROTEIN',
    proteinScore: 21.4,
  },
  {
    name: 'あじ',
    normalizedName: 'あじ',
    nutritionCategory: 'PROTEIN',
    proteinScore: 19.7,
  },
  {
    name: 'かつお',
    normalizedName: 'かつお',
    nutritionCategory: 'PROTEIN',
    proteinScore: 25.4,
  },
  {
    name: 'たら',
    normalizedName: 'たら',
    nutritionCategory: 'PROTEIN',
    proteinScore: 17.6,
  },
  {
    name: 'しらす',
    normalizedName: 'しらす',
    nutritionCategory: 'PROTEIN',
    proteinScore: 24.5,
  },
  {
    name: 'えび',
    normalizedName: 'えび',
    nutritionCategory: 'PROTEIN',
    proteinScore: 20,
  },
  {
    name: 'いか',
    normalizedName: 'いか',
    nutritionCategory: 'PROTEIN',
    proteinScore: 17.9,
  },
  {
    name: 'たこ',
    normalizedName: 'たこ',
    nutritionCategory: 'PROTEIN',
    proteinScore: 14.6,
  },

  // その他タンパク質
  {
    name: '卵',
    normalizedName: 'たまご',
    nutritionCategory: 'PROTEIN',
    proteinScore: 6,
  }, //1個換算
  {
    name: '木綿',
    normalizedName: 'もめん',
    nutritionCategory: 'PROTEIN',
    proteinScore: 7,
  }, //100g換算
  {
    name: '絹',
    normalizedName: 'きぬ',
    nutritionCategory: 'PROTEIN',
    proteinScore: 5.3,
  }, //100g換算
  {
    name: '納豆',
    normalizedName: 'なっとう',
    nutritionCategory: 'PROTEIN',
    proteinScore: 8,
  }, //1パック換算

  // 野菜
  //メモ：厚生労働省が推奨する成人の1日あたりの野菜摂取目標量は350g以上
  //そのうち、緑黄色野菜は120グラム以上摂取.残りの230グラムは淡色野菜（キャベツ、大根、たまねぎなど）で補うのが理想的なバランス
  {
    name: 'キャベツ',
    normalizedName: 'きゃべつ',
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'LIGHT',
  },
  {
    name: 'レタス',
    normalizedName: 'れたす',
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'LIGHT',
  },
  {
    name: 'トマト',
    normalizedName: 'とまと',
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'GREEN_YELLOW',
  },
  {
    name: 'きゅうり',
    normalizedName: 'きゅうり',
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'LIGHT',
  },
  {
    name: 'にんじん',
    normalizedName: 'にんじん',
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'GREEN_YELLOW',
  },
  {
    name: '玉ねぎ',
    normalizedName: 'たまねぎ',
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'LIGHT',
  },
  {
    name: 'じゃがいも',
    normalizedName: 'じゃがいも',
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'LIGHT',
  },
  {
    name: 'ピーマン',
    normalizedName: 'ぴーまん',
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'GREEN_YELLOW',
  },
  {
    name: 'なす',
    normalizedName: 'なす',
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'LIGHT',
  },
  {
    name: 'ブロッコリー',
    normalizedName: 'ぶろっこりー',
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'GREEN_YELLOW',
  },
  {
    name: 'ほうれん草',
    normalizedName: 'ほうれんそう',
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'GREEN_YELLOW',
  },
  {
    name: '小松菜',
    normalizedName: 'こまつな',
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'GREEN_YELLOW',
  },

  //  炭水化物
  {
    name: 'ご飯',
    normalizedName: 'ごはん',
    nutritionCategory: 'CARB',
    proteinScore: 3.5,
  }, //100g換算
  {
    name: '米',
    normalizedName: 'こめ',
    nutritionCategory: 'CARB',
    proteinScore: 3.5,
  }, //100g換算
  {
    name: 'パン',
    normalizedName: 'ぱん',
    nutritionCategory: 'CARB',
    proteinScore: 8.9,
  }, //100g換算（食パンにて換算）
  {
    name: 'うどん',
    normalizedName: 'うどん',
    nutritionCategory: 'CARB',
    proteinScore: 6.1,
  }, //100g換算
  {
    name: 'パスタ',
    normalizedName: 'ぱすた',
    nutritionCategory: 'CARB',
    proteinScore: 7.8,
  }, //100g換算
  {
    name: '蕎麦',
    normalizedName: 'そば',
    nutritionCategory: 'CARB',
    proteinScore: 9.8,
  }, //100g換算
];
