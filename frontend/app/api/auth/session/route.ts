import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

function decodeJwtPayload(token: string) {
    try {
        const [, payload] = token.split('.')
        return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'))
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
            userId: null,
        })
    }

    const payload = decodeJwtPayload(token)

    return NextResponse.json({
        isAuthenticated: true,
        role: payload?.role ?? null,
        userId: payload?.userId ?? null,
    })
}