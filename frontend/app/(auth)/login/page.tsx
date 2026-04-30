'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { login } from '@/lib/api'

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const redirectTo = searchParams.get('redirect') || '/dashboard'

    const [email, setEmail] = useState('admin@portfolio.com')
    const [password, setPassword] = useState('Admin1234')
    // const [email, setEmail] = useState('nic@navodaya.edu')
    // const [password, setPassword] = useState('NIC@navodaya2083')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await login(email, password)
            router.replace(redirectTo)
            router.refresh()
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Something went wrong while logging in')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-slate-100 px-4 py-10 md:py-16">
            <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow">
                <h1 className="text-2xl font-semibold mb-6">Login</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 text-sm">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full rounded border px-3 py-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1 text-sm">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full rounded border px-3 py-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
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
        </div>
    )
}