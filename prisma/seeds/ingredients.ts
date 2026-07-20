//食材マスタ

import { NutritionCategory, vegetableType } from '@/lib/nutrition/typs';

type IngredientMaster = {
  name: string;
  aliases: string[];
  nutritionCategory: NutritionCategory;
  vegetableType?: vegetableType;
  proteinScore?: number;
  unitConversions?: Record<string, number>;
};

export const ingredientsData: IngredientMaster[] = [
  // タンパク質（肉）（100g換算）
  {
    name: '鶏むね',
    aliases: ['鶏むね', '鶏胸', '鶏胸肉', 'とりむね', 'とり胸', '鶏むね肉'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 19.5,
  },
  {
    name: '鶏もも',
    aliases: ['鶏もも', '鶏モモ', '鶏もも肉', 'とりもも', '鳥もも'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 17.3,
  },
  {
    name: 'ささみ',
    aliases: ['ささみ', 'ササミ', '鶏ささみ'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 24.6,
  },
  {
    name: '豚ロース',
    aliases: ['豚ロース', 'ロース', '豚ロース肉', 'ぶたろーす'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 22.7,
  },
  {
    name: '豚こま',
    aliases: ['豚こま', '豚こま肉', '豚小間', '豚細切れ', '豚切り落とし'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 18.5,
  },
  {
    name: '豚バラ',
    aliases: ['豚バラ', '豚ばら', '豚バラ肉', 'ばら肉'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 13.4,
  },
  {
    name: '豚ヒレ',
    aliases: ['豚ヒレ', '豚ひれ', 'ヒレ肉', 'フィレ'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 22.2,
  },

  {
    name: '牛こま',
    aliases: ['牛こま', '牛こま肉', '牛小間', '牛切り落とし'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 17,
  },
  {
    name: '牛もも',
    aliases: ['牛もも', '牛モモ', '牛もも肉'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 19.2,
  },
  {
    name: '牛ヒレ',
    aliases: ['牛ヒレ', '牛ひれ', '牛フィレ', 'ヒレ'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 19.1,
  },

  {
    name: '鶏ひき',
    aliases: ['鶏ひき', '鶏ひき肉', '鶏ミンチ', 'とりひき'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 17.5,
  },
  {
    name: '豚ひき',
    aliases: ['豚ひき', '豚ひき肉', '豚ミンチ', 'ぶたひき'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 17.7,
  },
  {
    name: '合い挽き',
    aliases: ['合い挽き', '合挽き', '合いびき', '合挽き肉', 'あいびき'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 17.3,
  },
  {
    name: 'ひき肉',
    aliases: ['ひき肉', '挽き肉', 'ミンチ'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 17.5,
  },

  //  魚（100g換算）
  {
    name: '鮭',
    aliases: ['鮭', 'さけ', 'サケ', 'しゃけ', 'シャケ'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 21.7,
  },
  {
    name: 'サーモン',
    aliases: ['サーモン', 'さーもん'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 20.1,
  },
  {
    name: 'さば',
    aliases: ['さば', 'サバ', '鯖'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 20.6,
  },
  {
    name: 'いわし',
    aliases: ['いわし', 'イワシ', '鰯'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 19.2,
  },
  {
    name: 'まぐろ',
    aliases: ['まぐろ', 'マグロ', '鮪'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 24.3,
  },
  {
    name: 'ぶり',
    aliases: ['ぶり', 'ブリ', '鰤'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 21.4,
  },
  {
    name: 'あじ',
    aliases: ['あじ', 'アジ', '鯵'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 19.7,
  },
  {
    name: 'かつお',
    aliases: ['かつお', 'カツオ', '鰹'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 25.4,
  },
  {
    name: 'たら',
    aliases: ['たら', 'タラ', '鱈'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 17.6,
  },
  {
    name: 'しらす',
    aliases: ['しらす', 'シラス', 'しらす干し'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 24.5,
  },
  {
    name: 'えび',
    aliases: ['えび', 'エビ', '海老'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 20,
  },
  {
    name: 'いか',
    aliases: ['いか', 'イカ', '烏賊'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 17.9,
  },
  {
    name: 'たこ',
    aliases: ['たこ', 'タコ', '蛸'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 14.6,
  },

  // その他タンパク質
  {
    name: '卵',
    aliases: ['卵', 'たまご', '玉子', '鶏卵', '全卵', '生卵'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 6,
  }, //1個換算
  {
    name: '木綿',
    aliases: ['木綿', '木綿豆腐', 'もめん', 'もめん豆腐'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 7,
  }, //100g換算
  {
    name: '絹',
    aliases: ['絹', '絹豆腐', 'きぬ', 'きぬ豆腐'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 5.3,
  }, //100g換算
  {
    name: '納豆',
    aliases: ['納豆', 'なっとう'],
    nutritionCategory: 'PROTEIN',
    proteinScore: 8,
  }, //1パック換算

  // 野菜
  //メモ：厚生労働省が推奨する成人の1日あたりの野菜摂取目標量は350g以上
  //そのうち、緑黄色野菜は120グラム以上摂取.残りの230グラムは淡色野菜（キャベツ、大根、たまねぎなど）で補うのが理想的なバランス
  // メモ：重量は一般的な大きさの食材を基準にした栄養計算用の目安値
  {
    name: 'キャベツ',
    aliases: ['キャベツ', 'きゃべつ'],
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'LIGHT',
    unitConversions: { 個: 1200, 枚: 50 },
  },
  {
    name: 'レタス',
    aliases: ['レタス', 'れたす'],
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'LIGHT',
    unitConversions: { 個: 400, 枚: 30 },
  },
  {
    name: 'トマト',
    aliases: ['トマト', 'とまと'],
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'GREEN_YELLOW',
    unitConversions: { 個: 200 },
  },
  {
    name: 'きゅうり',
    aliases: ['きゅうり', '胡瓜', 'キュウリ'],
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'LIGHT',
    unitConversions: { 本: 100 },
  },
  {
    name: 'にんじん',
    aliases: ['にんじん', '人参', 'ニンジン'],
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'GREEN_YELLOW',
    unitConversions: { 本: 150 },
  },
  {
    name: '玉ねぎ',
    aliases: ['玉ねぎ', 'たまねぎ', '玉ネギ', 'タマネギ'],
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'LIGHT',
    unitConversions: { 個: 200 },
  },
  {
    name: 'じゃがいも',
    aliases: ['じゃがいも', 'ジャガイモ', '馬鈴薯'],
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'LIGHT',
    unitConversions: { 個: 150 },
  },
  {
    name: 'ピーマン',
    aliases: ['ピーマン', 'ぴーまん'],
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'GREEN_YELLOW',
    unitConversions: { 個: 30 },
  },
  {
    name: 'なす',
    aliases: ['なす', 'ナス', '茄子'],
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'LIGHT',
    unitConversions: { 本: 80, 個: 80 },
  },
  {
    name: 'ブロッコリー',
    aliases: ['ブロッコリー', 'ぶろっこりー'],
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'GREEN_YELLOW',
    unitConversions: { 個: 250 },
  },
  {
    name: 'ほうれん草',
    aliases: ['ほうれん草', 'ほうれんそう', 'ホウレンソウ'],
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'GREEN_YELLOW',
    unitConversions: { 束: 200, 袋: 200 },
  },
  {
    name: '小松菜',
    aliases: ['小松菜', 'こまつな', 'コマツナ'],
    nutritionCategory: 'VEGETABLE',
    vegetableType: 'GREEN_YELLOW',
    unitConversions: { 束: 300, 袋: 200 },
  },

  //  炭水化物
  {
    name: 'ご飯',
    aliases: ['ご飯', 'ごはん', '白飯', '白ご飯', 'ライス'],
    nutritionCategory: 'CARB',
    proteinScore: 3.5,
  }, //100g換算
  {
    name: '米',
    aliases: ['米', 'こめ', '白米', '精米'],
    nutritionCategory: 'CARB',
    proteinScore: 3.5,
  }, //100g換算
  {
    name: 'パン',
    aliases: ['パン', 'ぱん', '食パン'],
    nutritionCategory: 'CARB',
    proteinScore: 8.9,
  }, //100g換算（食パンにて換算）
  {
    name: 'うどん',
    aliases: ['うどん', '饂飩', 'ウドン'],
    nutritionCategory: 'CARB',
    proteinScore: 6.1,
  }, //100g換算
  {
    name: 'パスタ',
    aliases: ['パスタ', 'ぱすた', 'スパゲッティ', 'スパゲティ'],
    nutritionCategory: 'CARB',
    proteinScore: 7.8,
  }, //100g換算
  {
    name: '蕎麦',
    aliases: ['蕎麦', 'そば', 'ソバ'],
    nutritionCategory: 'CARB',
    proteinScore: 9.8,
  }, //100g換算
];
