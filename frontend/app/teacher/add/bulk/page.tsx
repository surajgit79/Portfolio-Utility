'use client'

import { useState } from 'react'

export default function BulkTeacherUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!file) {
      setError('Please select a CSV file')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      setLoading(true)

      const res = await fetch('http://localhost:3001/api/v1/teachers/bulk', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.message || 'Bulk upload failed')
        return
      }

      setMessage(data?.message || 'Bulk upload successful')
      setFile(null)
    } catch (err) {
      setError('Something went wrong while uploading the CSV')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 rounded-xl bg-white p-6 shadow">
      <h1 className="text-2xl font-semibold mb-6">Bulk Upload Teachers</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium">CSV File</label>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full rounded border px-3 py-2"
          />
        </div>

        {file && (
          <p className="text-sm text-gray-600">
            Selected: {file.name}
          </p>
        )}

        {message && <p className="text-sm text-green-600">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </form>
    </div>
  )
}