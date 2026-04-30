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

    const isTrainingAddPage = pathname === '/trainings/add'
    const isTrainingBulkPage = pathname === '/trainings/add/bulk'
    const isTrainingEditPage = /^\/trainings\/[^/]+\/edit$/.test(pathname)

    const isProtectedPage =
        isDashboardPage ||
        isTeacherAddPage ||
        isTeacherBulkPage ||
        isTeacherEditPage ||
        isTrainingAddPage ||
        isTrainingBulkPage ||
        isTrainingEditPage

    if (isLoggedIn && isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (!isLoggedIn && isProtectedPage) {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/login', '/dashboard', '/teachers/:path*', '/trainings/:path*'],
}