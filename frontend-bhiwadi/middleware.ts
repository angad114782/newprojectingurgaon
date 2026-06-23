import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Trailing slash removal
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    const clean = url.pathname.slice(0, -1);
    return NextResponse.redirect(new URL(clean + url.search, req.url), { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|svg|ico|webp|avif|gif|woff2?|ttf|eot|css|js)).*)'],
};
