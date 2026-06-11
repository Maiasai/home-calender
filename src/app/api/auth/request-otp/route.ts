import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

//OTP/確認メールを送る用
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Supabase Admin（サーバー専用）Authユーザーが存在するか確認する用
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const POST = async (req: NextRequest) => {
  try {
    const { email } = await req.json();

    // ① Prismaでユーザー確認
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // ② Googleユーザーなら弾く
    if (user && user.authProvider === 'GOOGLE') {
      return NextResponse.json(
        { message: 'Googleユーザーです' },
        { status: 400 },
      );
    }
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();

    const authUser = usersData.users.find((u) => u.email === email);

    const isNewAuthUser = !authUser;

    // ③ SupabaseでOTP送信
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      let message = error.message;

      if (message.includes('For security purposes')) {
        const match = message.match(/after (\d+) seconds/);

        if (match) {
          message = `あと${match[1]}秒後に再度お試しください`;
        } else {
          message = '一定時間あけてから再度お試しください';
        }
      }

      return NextResponse.json({ message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,

      needsEmailConfirmation: isNewAuthUser,
    });
  } catch (error) {
    //想定外エラー
    console.error(error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 },
    );
  }
};
