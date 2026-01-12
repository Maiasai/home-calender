//レシピ一覧API
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



const TEMP_USER_ID = "TEMP_USER_ID"; //認証まわり実装してからTEMP_USER_IDをログインユーザーIDに差し替える

export const GET = async (request:NextRequest) => {
  // //1)tokenをとる
  // const token = request.headers.get("Authorization")??"";

  // //2)認証（superbase)※ 認証で userId を取る
  // const{ data , error }=await supabase.auth.getUser(token);

  // if(error){
  //   return NextResponse.json(
  //     {status:error.message},
  //     {status:400}
  //   );
  // }

  // const userId = data.user?.id;

  try{
    const recipes = await prisma.recipe.findMany({
      where : { //持ち主が TEMP_USER_ID のレシピだけを
        ownerUserId : TEMP_USER_ID,
      },
      orderBy : { //作成日が新しい順に
        createdAt : "desc",
      },
      select : { //一覧表示に必要な項目だけ」取る
        id:true,
        title:true,
        category:true,
        thumbnailUrl:true,
        createdAt:true,
      },
    });
    console.log(recipes);

      return NextResponse.json(
        {status:"OK",recipes:recipes},
        {status:200}
      );

    }catch(e){
     if (e instanceof Error){
       return NextResponse.json(
         {status:e.message},
         {status:500}
       );
      }
        return NextResponse.json(
          {status:"Unknown error"},
          {status:500}
        );
    }
};
