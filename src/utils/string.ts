// 文字数カット　汎用コンポーネント

export const truncate = (text: string, maxLength: number = 10) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
