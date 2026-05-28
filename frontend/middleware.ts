import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  const url = req.nextUrl;

  // 301 www → non-www redirect
  if (host.startsWith('www.')) {
    const nonWwwHost = host.slice(4);
    const redirectUrl = `${proto}://${nonWwwHost}${url.pathname}${url.search}`;
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  // Remove trailing slash (except root)
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    const clean = url.pathname.slice(0, -1);
    return NextResponse.redirect(new URL(clean + url.search, req.url), { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|svg|ico|webp|avif|gif|woff2?|ttf|eot|css|js)).*)'],
};
