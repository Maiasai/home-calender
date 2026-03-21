//入力された全角数字を半角に、1/2などの値を小数点に変換するコンポーネント
//APIでも使えるようにするために'use client'は不要

// 全角→半角、スラッシュ変換
const normalizeFraction = (input: string): string => {
  return input
    .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    .replace(/[／∕]/g, "/");
};

// 文字列を小数に変換
export const parseFraction = (input: string): number => {//複数関数をどうファイルからexportしたい場合に使用
  const normalized = normalizeFraction(input.trim());

  if (normalized.includes("/")) {
    const [numerator, denominator] = normalized.split("/").map(Number);
    if (!isNaN(numerator) && !isNaN(denominator)) {
      return numerator / denominator;
    }
  }

  const result = parseFloat(normalized);
  return isNaN(result) ? 0 : result; // 空文字や不正文字は0に
};