'use client'

import { useEffect, useState } from 'react'

type Session = {
    isAuthenticated: boolean
    role: string | null
    userId: string | null
}

export function useSession() {
    const [session, setSession] = useState<Session>({
        isAuthenticated: false,
        role: null,
        userId: null,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/auth/session', {
            cache: 'no-store',
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(setSession)
            .catch(() =>
                setSession({
                    isAuthenticated: false,
                    role: null,
                    userId: null,
                })
            )
            .finally(() => setLoading(false))
    }, [])

    return { session, loading }
}