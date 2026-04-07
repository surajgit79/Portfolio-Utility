
// Get all users
export async function getUsers() {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!BASE_URL)
        throw new Error('BACKEND_URL not set')
    const res = await fetch(BASE_URL)

    if (!res.ok)
        throw new Error('Unable to fetch data')

    return res.json()
}

// Get user by id
export async function getUser(id: number){
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL+'/'+id
    if (!BASE_URL)
        throw new Error('BACKEND_URL not set')
    const res = await fetch(BASE_URL)

    if (!res.ok)
        throw new Error('Unable to fetch data')

    return res.json()
}