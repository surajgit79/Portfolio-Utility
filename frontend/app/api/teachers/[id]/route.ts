import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

type RouteContext = {
    params: Promise<{ id: string }>
}

export async function DELETE(_: Request, context: RouteContext) {
    try {
        const { id } = await context.params
        const token = (await cookies()).get('accessToken')?.value
        const BASE_URL = process.env.BACKEND_URL

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

        const res = await fetch(`${BASE_URL}/teachers/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const contentType = res.headers.get('content-type') || ''

        const data = contentType.includes('application/json')
            ? await res.json()
            : await res.text()

        if (!res.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        typeof data === 'string'
                            ? data || 'Delete failed'
                            : data?.message || 'Delete failed',
                },
                { status: res.status }
            )
        }

        return NextResponse.json(
            typeof data === 'string'
                ? { success: true, message: data }
                : data
        )
    } catch (error) {
        console.error('Delete teacher route error:', error)

        return NextResponse.json(
            { success: false, message: 'Something went wrong while deleting teacher' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const token = (await cookies()).get('accessToken')?.value
        const backendUrl = process.env.BACKEND_URL

        if (!backendUrl) {
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

        const formData = await req.formData()

        const res = await fetch(`${backendUrl}/teachers/${id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        const data = await res.json()

        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        console.error('Update teacher route error:', error)

        return NextResponse.json(
            { success: false, message: 'Teacher update failed' },
            { status: 500 }
        )
    }
}