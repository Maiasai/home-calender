//食材マスタ

import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const ingredientsData = [
  // タンパク質（肉）
  { name: '鶏肉', normalizedName: 'とりにく', nutritionCategory: 'PROTEIN' },
  { name: '豚肉', normalizedName: 'ぶたにく', nutritionCategory: 'PROTEIN' },
  { name: '牛肉', normalizedName: 'ぎゅうにく', nutritionCategory: 'PROTEIN' },
  { name: 'ひき肉', normalizedName: 'ひきにく', nutritionCategory: 'PROTEIN' },

  //  魚
  { name: '鮭', normalizedName: 'さけ', nutritionCategory: 'PROTEIN' },
  {
    name: 'サーモン',
    normalizedName: 'さーもん',
    nutritionCategory: 'PROTEIN',
  },
  { name: 'さば', normalizedName: 'さば', nutritionCategory: 'PROTEIN' },
  { name: 'いわし', normalizedName: 'いわし', nutritionCategory: 'PROTEIN' },
  { name: 'まぐろ', normalizedName: 'まぐろ', nutritionCategory: 'PROTEIN' },

  // その他タンパク質
  { name: '卵', normalizedName: 'たまご', nutritionCategory: 'PROTEIN' },
  { name: '豆腐', normalizedName: 'とうふ', nutritionCategory: 'PROTEIN' },
  { name: '納豆', normalizedName: 'なっとう', nutritionCategory: 'PROTEIN' },

  //  野菜（メジャー）
  {
    name: 'キャベツ',
    normalizedName: 'きゃべつ',
    nutritionCategory: 'VEGETABLE',
  },
  { name: 'レタス', normalizedName: 'れたす', nutritionCategory: 'VEGETABLE' },
  { name: 'トマト', normalizedName: 'とまと', nutritionCategory: 'VEGETABLE' },
  {
    name: 'きゅうり',
    normalizedName: 'きゅうり',
    nutritionCategory: 'VEGETABLE',
  },
  {
    name: 'にんじん',
    normalizedName: 'にんじん',
    nutritionCategory: 'VEGETABLE',
  },
  {
    name: '玉ねぎ',
    normalizedName: 'たまねぎ',
    nutritionCategory: 'VEGETABLE',
  },
  {
    name: 'じゃがいも',
    normalizedName: 'じゃがいも',
    nutritionCategory: 'VEGETABLE',
  },
  {
    name: 'ピーマン',
    normalizedName: 'ぴーまん',
    nutritionCategory: 'VEGETABLE',
  },
  { name: 'なす', normalizedName: 'なす', nutritionCategory: 'VEGETABLE' },
  {
    name: 'ブロッコリー',
    normalizedName: 'ぶろっこりー',
    nutritionCategory: 'VEGETABLE',
  },
  {
    name: 'ほうれん草',
    normalizedName: 'ほうれんそう',
    nutritionCategory: 'VEGETABLE',
  },
  {
    name: '小松菜',
    normalizedName: 'こまつな',
    nutritionCategory: 'VEGETABLE',
  },

  //  炭水化物
  { name: 'ご飯', normalizedName: 'ごはん', nutritionCategory: 'CARB' },
  { name: 'パン', normalizedName: 'ぱん', nutritionCategory: 'CARB' },
  { name: 'うどん', normalizedName: 'うどん', nutritionCategory: 'CARB' },
  { name: 'パスタ', normalizedName: 'ぱすた', nutritionCategory: 'CARB' },
];
