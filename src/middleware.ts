import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isProtectedRoute = (pathname: string) => {
  const protectedRoutes = [
    '/contacts',
    '/dex',
    '/settings',
    '/card',
    '/peer',
    '/share',
  ];
  
  return protectedRoutes.some(route => pathname.startsWith(route));
};

export function middleware(request: NextRequest) {
  // Temporarily disable middleware to test navigation
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
