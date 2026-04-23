import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const BASE_URL = process.env.BACKEND_URL
        const token = (await cookies()).get('accessToken')?.value

        if (!BASE_URL) {
            return NextResponse.json(
                { success: false, message: 'BACKEND_URL not set' },
                { status: 500 }
            )
        }

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const res = await fetch(`${BASE_URL}/teachers/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })

        const json = await res.json()

        return NextResponse.json(json, { status: res.status })
    } catch (error) {
        console.error('Register teacher route error:', error)

        return NextResponse.json(
            { success: false, message: 'Something went wrong while registering teacher' },
            { status: 500 }
        )
    }
}