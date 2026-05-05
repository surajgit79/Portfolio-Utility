import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const trainingId = searchParams.get('trainingId')

        const BASE_URL = process.env.BACKEND_URL
        const token = (await cookies()).get('accessToken')?.value

        if (!trainingId) {
            return NextResponse.json(
                { success: false, message: 'trainingId is required' },
                { status: 400 }
            )
        }

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

        const res = await fetch(
            `${BASE_URL}/certificates/bulk/${trainingId}/download`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (!res.ok) {
            const text = await res.text()
            return NextResponse.json(
                { success: false, message: text || 'Bulk certificate download failed' },
                { status: res.status }
            )
        }

        const pdfBuffer = await res.arrayBuffer()

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${trainingId}-certificates.pdf"`,
            },
        })
    } catch (error) {
        console.error('Bulk certificate download route error:', error)

        return NextResponse.json(
            { success: false, message: 'Something went wrong while downloading bulk certificates' },
            { status: 500 }
        )
    }
}