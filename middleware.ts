import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/auth/callback') ||
    req.nextUrl.pathname.startsWith('/auth/recovery')
  ) {
    return NextResponse.next();
  }

  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            res.cookies.set(name, value),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback|login).*)',
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback|auth/recovery|login).*)',
  ],
};
