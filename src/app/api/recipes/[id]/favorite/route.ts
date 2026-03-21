//お気に入り登録API

import requireUser from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async(//PATCHは一部だけ更新
  request:NextRequest,
  {params}:{params:{id:string}}//ここでparams.idが「/recipes/123/favorite」の123になる
) =>{

  try{
    const user = await requireUser()

    const body = await request.json()//フロントからきたデータを読む
    const { isFavorite } = body
    const recipeId = params.id;

    const result = await prisma.userRecipeStatus.upsert({ //upsert→存在すればupdate、なければcreate
      where : {
        userId_recipeId : {//userIdとrecipeIdの組み合わせで探す
          userId:user.id,
          recipeId:recipeId
        }
      },
      update : {//データがあったらお気に入りを更新
        isFavorite:isFavorite
      },
      create:{//データがなければ新規作成
        userId:user.id,
        recipeId:recipeId,
        isFavorite:isFavorite
      }
    })
    return NextResponse.json(
      result,
      {status:200}
    )
  }catch{
    return NextResponse.json(
      {message:"失敗しました"},
      {status:500}
    )
  }
}