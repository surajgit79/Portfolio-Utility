import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
    const token = req.cookies.get('accessToken')?.value
    const { pathname } = req.nextUrl

    const isLoggedIn = !!token

    const isLoginPage = pathname === '/login'
    const isDashboardPage = pathname === '/dashboard'
    const isTeacherAddPage = pathname === '/teachers/add'
    const isTeacherBulkPage = pathname === '/teachers/add/bulk'
    const isTeacherEditPage = /^\/teachers\/[^/]+\/edit$/.test(pathname)

    // Logged-in users should not access login page
    if (isLoggedIn && isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Logged-out users cannot access protected pages
    if (
        !isLoggedIn &&
        (
            isDashboardPage ||
            isTeacherAddPage ||
            isTeacherBulkPage ||
            isTeacherEditPage
        )
    ) {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/login', '/dashboard', '/teachers/:path*'],
}