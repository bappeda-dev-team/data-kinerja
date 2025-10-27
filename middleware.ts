import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionId = request.cookies.get('sessionId')?.value

  // Daftar path publik yang boleh diakses tanpa login
  // const publicPaths = ['/login', '/register']
  const publicPaths = ['/', '/login', '/register']

  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p))

  // ❌ Belum login, tapi bukan di halaman public
  if (!sessionId && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ✅ Sudah login, tapi buka /login — lempar ke /
  if (sessionId && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // sudah login, tapi buka / lempar ke dashboard
  if (sessionId && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // ✅ Semua ok
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}