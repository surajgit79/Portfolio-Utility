'use client'

import { useRouter } from 'next/navigation'
import { logout } from '@/lib/api'
import { Button } from '../ui/button'

export function LogoutButton() {
    const router = useRouter()

    async function handleLogout() {
        try {
            await logout()
            router.replace('/login')
            router.refresh()
        } catch (err) {
            console.error('Logout failed:', err)
        }
    }

    return (
        <Button
            type="button"
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 text-white rounded-lg cursor-pointer"
        >
            Logout
        </Button>
    )
}