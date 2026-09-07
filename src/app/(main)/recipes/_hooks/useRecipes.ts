//カスタムフック（一覧検索）

import { Filters, RecipeData, RecipePageResponse } from '../_types/RecipeTypes';
import { fetcher } from '@/lib/featcher';
import useSWRInfinite from 'swr/infinite';

//filters = {keyword: "",category: "MAIN",favorite: false,cooked: false}
export const useRecipes = (filters: Filters) => {
  const getKey = (
    pageIndex: number,
    previousPageData: RecipePageResponse | null,
  ) => {
    //前ページに続きがなければ次のfetchをしない
    if (previousPageData && !previousPageData.hasMore) return null;
    const params = new URLSearchParams(); //空のクエリ（URLの ?の後ろ を作るための箱）を作成

    //それぞれの値がもしあれば、params.appendでparamsに「（例）keyword=カレー」の形で追加してる
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.category) params.append('category', filters.category);
    if (filters.favorite) params.append('favorite', 'true');
    if (filters.cooked) params.append('cooked', 'true');

    //新しくpageというパラメータを追加
    // pageIndexは0から始まるので、APIへは1を足して渡す
    params.append('page', String(pageIndex + 1));

    // URLSearchParamsを文字列に変換
    const query = params.toString();

    return `/api/recipes?${query}`;
  };

  //SWRがkey(query)変化を検知してfetcherを呼ぶ
  //ここのisLoadingはfetcher実行中かどうかを管理してくれてる（実行中ならisLoadingがture）
  //この場合error に入るのは fetcherがthrowしたエラー
  //isValidating→SWRがデータを取得・再確認しているかを表すboolean
  const { data, error, isLoading, isValidating, mutate, size, setSize } =
    useSWRInfinite<RecipePageResponse>(
      getKey,
      fetcher, //getKeyを実行→戻り値のURLをfetcherに渡す
      //＜設定＞次のページを読み込むとき、最初のページも改めて取得するか
      { revalidateFirstPage: false },
    );

  //取得済みの全ページを１つの配列にする
  const recipes: RecipeData[] =
    data?.flatMap((pageData) => pageData.recipes) ?? [];

  //最後に取得したページ
  const lastPage = data?.[data.length - 1];

  //次の１8件があるか判定(最後のページがあるなら、そのページのhasMoreを使う)
  const hasMore = lastPage?.hasMore ?? false;

  //さらに表示
  const loadMore = async () => {
    if (!hasMore || isValidating) return;

    await setSize((currentSize) => currentSize + 1);
  };

  const refreshRecipes = async (): Promise<void> => {
    await setSize(1);
    await mutate();
  };

  return {
    recipes, //SWRのdataを渡してる
    hasMore,
    loadMore,
    isLoading,
    isLoadingMore: isValidating && size > 1, //「さらに表示」を押したときにローディング表示を出すための値
    isError: error,
    refreshRecipes, // 登録・削除用
    mutate, // お気に入り・作った状態の変更用
  };
};
