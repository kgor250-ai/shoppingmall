import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl

  if (pathname === '/login') {
    if (sessionCookie) {
      try {
        const payload = await decrypt(sessionCookie)
        if (payload?.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', request.url))
        } else if (payload?.role === 'STORE_OWNER' && payload?.storeId) {
          return NextResponse.redirect(new URL('/store', request.url))
        }
      } catch {
        // invalid token, just continue to login
      }
    }
    return NextResponse.next()
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    try {
      const payload = await decrypt(sessionCookie)
      if (payload?.role !== 'ADMIN') {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('session')
      return response
    }
  }

  // Protect store routes
  if (pathname.startsWith('/store')) {
    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    try {
      const payload = await decrypt(sessionCookie)
      if (payload?.role !== 'STORE_OWNER') {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/store/:path*', '/login'],
}
