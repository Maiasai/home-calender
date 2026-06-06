//featcher用

import { supabase } from './supabase';

export const fetcher = async (url: string) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) {
    throw new Error('tokenがありません');
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('取得失敗');

  return res.json();
};
