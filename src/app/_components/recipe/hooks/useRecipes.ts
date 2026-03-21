//カスタムフック（一覧検索）

import useSWR from "swr";
import { Filters, RecipeData } from "../_types/RecipeTypes";


const fetcher = async (url:string)=>{//URL（/api/recipes?${query}）を受け取る
  const res =await fetch(url)//ここでfetch実行
  
  if(!res.ok) throw new Error("取得失敗");
  return res.json()
};

//filters = {keyword: "",category: "MAIN",favorite: false,cooked: false}
export const useRecipes = (filters:Filters)=>{
  const params = new URLSearchParams();//空のクエリ（URLの ?の後ろ を作るための箱）を作成

  //URLをここで作成　※「オブジェクト → URL構造」に変換
  if (filters.keyword) params.append("keyword",filters.keyword);

  //例）主菜が選択されたらparams.append("category", "MAIN")→category=MAINになる（内部的には{category: "MAIN"}）
  if (filters.category) params.append("category", filters.category);
  if (filters.favorite) params.append("favorite", "true");
  if (filters.cooked) params.append("cooked", "true");
  const query = params.toString();//ここでクエリを文字列化する（２つ値があったらこうなる（例）category=MAIN&favorite=true）

  //SWRがkey変化を検知してfetcherを呼ぶ
  const { data, error, isLoading, mutate } = useSWR<RecipeData[]>(
    `/api/recipes?${query}`,//第一引数　key
    fetcher//第二引数　fetcher関数
  );

  return {
    recipes: data,
    isLoading,
    isError: error,
    mutate,
  };
}