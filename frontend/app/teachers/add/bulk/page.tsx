'use client'

import { useState } from 'react'
import { H1, H3 } from '@/components/defaults/Typography'
import { Button } from '@/components/ui/button'
import { uploadTeachersCSV } from '@/lib/api'

export default function BulkAddTeacherPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleUpload() {
    setError('')
    setSuccess('')

    if (!file) {
      setError('Please select a CSV file')
      return
    }

    try {
      setLoading(true)
      const res = await uploadTeachersCSV(file)
      setSuccess(res?.message || 'Bulk upload successful')
      setFile(null)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Bulk upload failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-10">
      <H1 text="Bulk Upload Teachers" classNames="font-bold" />

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
          <Button onClick={handleUpload} disabled={loading} className='bg-[#2D84C4] h-10 rounded-md'>
            {loading ? 'Uploading...' : 'Upload CSV'}
          </Button>
        </div>
      </div>
    </div>
  )
}