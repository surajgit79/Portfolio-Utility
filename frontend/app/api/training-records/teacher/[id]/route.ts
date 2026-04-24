import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

type RouteContext = {
    params: Promise<{ id: string }>
}

export async function GET(_: Request, context: RouteContext) {
    try {
        const { id } = await context.params
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

        const res = await fetch(`${BASE_URL}/training-records/teacher/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const json = await res.json()

        return NextResponse.json(json, { status: res.status })
    } catch (error) {
        console.error('Training records route error:', error)

        return NextResponse.json(
            { success: false, message: 'Failed to fetch training records' },
            { status: 500 }
        )
    }
}