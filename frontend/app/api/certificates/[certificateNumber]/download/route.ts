import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ certificateNumber: string }> }
) {
    try {
        const { certificateNumber } = await params
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

        const res = await fetch(
            `${BASE_URL}/certificates/${certificateNumber}/download`,
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
                { success: false, message: text || 'Certificate download failed' },
                { status: res.status }
            )
        }

        const pdfBuffer = await res.arrayBuffer()

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${certificateNumber}.pdf"`,
            },
        })
    } catch (error) {
        console.error('Certificate download route error:', error)

        return NextResponse.json(
            { success: false, message: 'Something went wrong while downloading certificate' },
            { status: 500 }
        )
    }
}