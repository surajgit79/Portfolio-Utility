import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
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

        const incomingFormData = await req.formData()
        const file = incomingFormData.get('file')

        if (!(file instanceof File)) {
            return NextResponse.json(
                { success: false, message: 'CSV file is required' },
                { status: 400 }
            )
        }

        const outgoingFormData = new FormData()
        outgoingFormData.append('file', file)

        const res = await fetch(`${BASE_URL}/teachers/bulk`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: outgoingFormData,
        })

        const json = await res.json()

        return NextResponse.json(json, { status: res.status })
    } catch (error) {
        console.error('Bulk upload route error:', error)

        return NextResponse.json(
            { success: false, message: 'Something went wrong during bulk upload' },
            { status: 500 }
        )
    }
}