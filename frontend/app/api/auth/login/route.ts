import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const BASE_URL = process.env.BACKEND_URL

        if (!BASE_URL) {
            return NextResponse.json(
                { success: false, message: 'BACKEND_URL not set' },
                { status: 500 }
            )
        }

        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

        const contentType = res.headers.get('content-type') || ''

        if (!contentType.includes('application/json')) {
            const text = await res.text()
            console.error('Backend returned non-JSON:', text)

            return NextResponse.json(
                { success: false, message: 'Backend returned HTML instead of JSON' },
                { status: 500 }
            )
        }

        const json = await res.json()

        if (!res.ok || !json.success) {
            return NextResponse.json(
                { success: false, message: json?.message || 'Login failed' },
                { status: res.status }
            )
        }

        const { accessToken, refreshToken } = json.data
        const cookieStore = await cookies()

        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60,
        })

        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        })

        return NextResponse.json({
            success: true,
            message: 'Login successful',
        })
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { success: false, message: 'Something went wrong while logging in' },
            { status: 500 }
        )
    }
}