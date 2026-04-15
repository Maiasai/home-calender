//users取得API（ログインしてる人のDB上のユーザー情報を返す）
//流れ　ブラウザ（fetch /api/users/me）→　Next.js API　（Supabaseで認証確認→PrismaでDB取得）→DB

import requireUser from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { GetMeResponse } from '../../_types/ApiResponse';

export const GET = async () => {
  try {
    const user = await requireUser(); //ログインしている人かをsupabaseに聞いてる
    //結果）　user = {id: "c6fa914d-xxxx",email: "...",}　。もし未ログインならcatchに飛ぶ

    const dbUser = await prisma.user.findUnique({
      //DBの users テーブルを見に行ってる
      where: { id: user.id },
    });

    return NextResponse.json<GetMeResponse>({
      //DBのデータを「フロント用の形」に変換して返す
      user: dbUser
        ? {
            id: dbUser.id,
            email: dbUser.email,
            nickname: dbUser.nickname,
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
};
