//LoginFlowModalのメールアドレス入力から入力されたメールアドレスが
// DBに「存在するか」と「ログイン方法」だけ教えるを教えるAPI

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface CheckEmailRequest {
  email: string;
}

export const POST = async (request: NextRequest) => {
  try {
    //ここでフロントのbody: JSON.stringifyの "({ email: inputEmail })” を受け取ってる
    const body: CheckEmailRequest = await request.json();
    const { email } = body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const exists = !!user; //メールアドレスに該当するuserが返ってきたらtrue、なければnull=false
    const authProvider = user?.authProvider ?? null; //ユーザーがある時だけ「"EMAIL" or "GOOGLE"」取る、undefinedだったらnull

    return NextResponse.json({ exists, authProvider });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
};
