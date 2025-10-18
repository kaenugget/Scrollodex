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
    
    if (!authToken) {
      // Redirect to home page if not authenticated
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
