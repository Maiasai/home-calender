//API用認証チェック関数

import { createSupabaseServerClient } from "@/_libs/supabase-server";
import { User } from "@supabase/supabase-js";



const requireUser = async (): Promise<User> => {//ここで必ずUserを返すと宣言
  const supabase = await createSupabaseServerClient()
  
  //ここで返ってくるもの　useraData.user→ログインユーザー　userError→Supabase側のエラー
  const { data , error  } = await supabase.auth.getUser()

  if( error || !data.user ){
    throw new Error("Unauthorized");
  }
  return data.user;
}

export default requireUser;