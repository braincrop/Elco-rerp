// import { NextResponse } from 'next/server'
// export function middleware(request) {
//   const { pathname } = request.nextUrl
//   if (
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/static') ||
//     pathname === '/favicon.ico'
//   ) {
//     return NextResponse.next()
//   }
//   const token = request.cookies.get('token')?.value
//   const publicRoutes = ['/auth/sign-in','/auth/reset-password','/auth/verify-email']
//   if (publicRoutes.includes(pathname)) {
//     if (token) {
//       return NextResponse.redirect(new URL('/dashboards', request.url))
//     }
//     return NextResponse.next()
//   }

//   if (!token) {
//     return NextResponse.redirect(
//       new URL('/auth/sign-in', request.url)
//     )
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ['/((?!_next|static|favicon.ico).*)'],
// }
import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  const publicRoutes = [
    '/auth/sign-in',
    '/auth/reset-password',
    '/auth/verify-password',
    '/auth/reset-password',
  ]

  // ✅ startsWith use karo — query params bhi handle honge
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isPublicRoute) {
    if (token && pathname === '/auth/sign-in') {
      return NextResponse.redirect(new URL('/dashboards', request.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
}