//献立API

import { supabase } from "@/_libs/supabase";
import requireUser from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


//献立取得
export const GET = async (request:NextRequest)=>{
  try{
    const user = await requireUser()
    const userId= user.id

    const { searchParams } = new URL (request.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    if (!start || !end) {
      return NextResponse.json(
        { message: 'startとendは必須です' },
        { status: 400 }
      )
    }

    const mealdata = await prisma.menu.findMany({
      where : {
        userId,
        date : {
          gte : new Date(`${start}T00:00:00`),//DBの型が DateTime だから、Date型で渡す
          lte : new Date(`${end}T23:59:59`)
        }
      },
      include : {
        menuRecipes : {
          include : {
            recipe : true//リレーション
          },
        },
      },
      orderBy:{
        date:'asc',
      }
    })
      return NextResponse.json(
        mealdata,
        {status:200}
      )
    }catch(error){
      return NextResponse.json(
        {message:'error'},
        {status:500}
      )
    }
}


//献立新規作成
export const POST = async(request:NextRequest) => {
  try{
    const user = await requireUser()//ここでユーザーを特定している
    console.log('user',user)
    const userId = user.id

    const body = await request.json()
    const {date, recipes} = body;

    const mealplan = await prisma.menu.create ({
      data : {//dataは　CREATE/UPDATE用
        userId,
        date,
        
        menuRecipes : {
          create : recipes
        }
      }
    })
    return NextResponse.json(
      mealplan,
      {status:200}
    )
  }catch(error){
    console.error ( "API ERROR:", error );

    return NextResponse.json(
      {message:"サーバーエラーが発生しました"},
      {status:500}
    )
  }
}

