import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

function decode(token: string) {
    try {
        const [, payload] = token.split('.')
        return JSON.parse(
            Buffer.from(payload, 'base64url').toString()
        )
    } catch {
        return null
    }
}

export async function GET() {
    const token = (await cookies()).get('accessToken')?.value

    if (!token) {
        return NextResponse.json({
            isAuthenticated: false,
            role: null,
        })
    }

    const payload = decode(token)

    return NextResponse.json({
        isAuthenticated: true,
        role: payload?.role ?? null,
        userId: payload?.userId ?? null,
    })
}