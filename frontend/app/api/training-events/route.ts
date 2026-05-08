import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
    try {
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

        const res = await fetch(`${BASE_URL}/training-events`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const data = await res.json()

        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        console.error('Training events route error:', error)

        return NextResponse.json(
            { success: false, message: 'Failed to fetch training events' },
            { status: 500 }
        )
    }
}