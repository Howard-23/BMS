import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(req: NextRequest) {
  const { nextUrl } = req
  
  // Get token from request (JWT session)
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  const isLoggedIn = !!token
  
  const isAuthPage = nextUrl.pathname.startsWith('/login') || 
                     nextUrl.pathname.startsWith('/register')
  const isPublicPage = nextUrl.pathname === '/' || 
                       nextUrl.pathname.startsWith('/portal') ||
                       nextUrl.pathname.startsWith('/services') ||
                       nextUrl.pathname.startsWith('/marketplace') ||
                       nextUrl.pathname.startsWith('/announcements') ||
                       nextUrl.pathname.startsWith('/contact') ||
                       nextUrl.pathname.startsWith('/api/auth')

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
    return NextResponse.next()
  }

  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)']
}

// The "proxy" export replaces the deprecated "middleware" convention
// This runs at the Edge Runtime to handle auth redirects
