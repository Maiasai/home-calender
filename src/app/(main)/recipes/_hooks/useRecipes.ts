//カスタムフック（一覧検索）

import useSWR from 'swr';
import { Filters, RecipeData } from '../_types/RecipeTypes';
import { fetcher } from '@/lib/featcher';

//filters = {keyword: "",category: "MAIN",favorite: false,cooked: false}
export const useRecipes = (filters: Filters) => {
  const params = new URLSearchParams(); //空のクエリ（URLの ?の後ろ を作るための箱）を作成

  //それぞれの値がもしあれば、params.appendでparamsに「（例）keyword=カレー」の形で追加してる
  if (filters.keyword) params.append('keyword', filters.keyword);
  if (filters.category) params.append('category', filters.category);
  if (filters.favorite) params.append('favorite', 'true');
  if (filters.cooked) params.append('cooked', 'true');
  const query = params.toString(); //ここでクエリを文字列化する（２つ値があったらこうなる（例）category=MAIN&favorite=true）

  //SWRがkey(query)変化を検知してfetcherを呼ぶ
  //ここのisLoadingはfetcher実行中かどうかを管理してくれてる（実行中ならisLoadingがture）
  //この場合error に入るのは fetcherがthrowしたエラー
  const { data, error, isLoading, mutate } = useSWR<RecipeData[]>(
    `/api/recipes?${query}`,
    fetcher,
  );

  return {
    recipes: data, //SWRのdataを渡してる
    isLoading,
    isError: error,
    mutate,
  };
};
