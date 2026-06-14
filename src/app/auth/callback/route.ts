import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/auth/complete';

  if (!code) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }

  const isEmailChanged = next.includes('emailChanged=true');

  //メール変更時のみ以下処理。
  if (isEmailChanged) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id && user.email) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          email: user.email,
        },
      });
    }
  }
  if (isEmailChanged) {
    return NextResponse.redirect(
      new URL('/?emailChanged=complete', request.url),
    );
  }

  return NextResponse.redirect(new URL(next, request.url));
};
