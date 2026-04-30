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

    const formData = await req.formData()

    const res = await fetch(`${BASE_URL}/upload/training-records`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const json = await res.json()

    return NextResponse.json(json, { status: res.status })
  } catch (error) {
    console.error('Training records bulk upload error:', error)

    return NextResponse.json(
      { success: false, message: 'Something went wrong during training records upload' },
      { status: 500 }
    )
  }
}