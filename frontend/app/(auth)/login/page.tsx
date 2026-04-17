'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const redirectTo = searchParams.get('redirect') || '/dashboard'

    const [email, setEmail] = useState('admin@portfolio.com')
    const [password, setPassword] = useState('Admin1234')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')
        console.log(JSON.stringify({email, password}))
        try {
            const res = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const json = await res.json()

            if (!res.ok) {
                setError(json?.message || 'Login failed')
                return
            }
            router.replace(redirectTo)
            router.refresh()
        } catch {
            setError('Something went wrong while logging in')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 mb-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-xl bg-white p-6 shadow"
            >
                <h1 className="text-2xl font-semibold mb-6">Login</h1>

                <div className="mb-4">
                    <label className="block mb-1 text-sm">Email</label>
                    <input
                        type="email"
                        className="w-full rounded border px-3 py-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm">Password</label>
                    <input
                        type="password"
                        className="w-full rounded border px-3 py-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error ? (
                    <p className="mb-4 text-sm text-red-600">{error}</p>
                ) : null}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}