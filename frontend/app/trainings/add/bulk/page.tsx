'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { H1, H3 } from '@/components/defaults/Typography'
import { Button } from '@/components/ui/button'
import { uploadTrainingRecordsCSV } from '@/lib/api'

export default function BulkAddTrainingRecordsPage() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const router = useRouter()

    async function handleUpload() {
        setError('')
        setSuccess('')

        if (!file) {
            setError('Please select a CSV file')
            return
        }

        try {
            setLoading(true)

            const res = await uploadTrainingRecordsCSV(file)

            setSuccess(res?.message || 'Training records bulk upload completed')
            setFile(null)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Training records bulk upload failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-10">
            <div className="flex justify-between items-center">
                <H1 text="Bulk Upload Training Records" classNames="font-bold" />

                <Button
                    variant="outline"
                    className="bg-[#2D84C4] text-white cursor-pointer"
                    onClick={() => {
                        router.back()
                        router.refresh()
                    }}
                >
                    Back
                </Button>
            </div>

            <div className="bg-white rounded-lg p-6 mt-6">
                <H3 text="Upload CSV File" classNames="font-bold mb-4" />

                <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full rounded border px-3 py-2"
                />

                {file && (
                    <p className="mt-3 text-sm text-gray-600">
                        Selected: {file.name}
                    </p>
                )}

                {error && (
                    <p className="mt-4 text-sm text-red-600">{error}</p>
                )}

                {success && (
                    <p className="mt-4 text-sm text-green-600">{success}</p>
                )}

                <div className="mt-6">
                    <Button
                        onClick={handleUpload}
                        disabled={loading}
                        className="bg-[#2D84C4] h-10 rounded-md"
                    >
                        {loading ? 'Uploading...' : 'Upload CSV'}
                    </Button>
                </div>
            </div>
        </div>
    )
}