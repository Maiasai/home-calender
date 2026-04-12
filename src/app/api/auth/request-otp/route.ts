import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Admin（サーバー専用）
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

    // ③ SupabaseでOTP送信
    const { error } = await supabaseAdmin.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    console.log('OTP error:', error);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
};
