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
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  if (isProtectedRoute(pathname)) {
    // Check for auth token in cookies or headers
    const authToken = request.cookies.get('authToken')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '');
    
    // For now, allow access to protected routes - authentication will be handled client-side
    // This prevents the redirect loop issue
    if (!authToken) {
      // Don't redirect, let the client-side auth handle it
      console.log('No auth token found in middleware, but allowing access for client-side auth check');
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
