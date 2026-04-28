//featcher用

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('データ取得失敗');
  }

  return res.json();
};
