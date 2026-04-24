import Teacher from "@/app/teachers/[id]/page"
import type { Teachers, Training, Program, EventRecords, Career, TrainingAttended, Pagination } from "@/types"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL not set.')
}

type ApiResponse<T> = {
    success: boolean
    message: string
    data: T
    errors?: unknown[]
}

async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
        })

        const json: ApiResponse<T> = await res.json()

        if (!res.ok || !json.success) {
            throw new Error(json.message || 'API request failed')
        }

        return json.data
    } catch (error) {
        console.error(`API error on ${endpoint}:`, error)
        throw error
    }
}

export type LoginPayload = {
    accessToken: string
    refreshToken: string
}

export async function login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })

    const contentType = res.headers.get('content-type') || ''

    if (!contentType.includes('application/json')) {
        const text = await res.text()
        console.error('Non-JSON response from /api/auth/login:', text)
        throw new Error('Login route returned HTML instead of JSON')
    }

    const json = await res.json()

    if (!res.ok || !json.success) {
        throw new Error(json?.message || 'Login failed')
    }

    return json as {
        success: boolean
        message: string
    }
}

export async function logout() {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
    })

    const json = await res.json()

    if (!res.ok || !json.success) {
        throw new Error(json?.message || 'Logout failed')
    }

    return json
}

export type TeachersResponse = {
    success: boolean,
    message: string,
    data: Teachers[]
    pagination: Pagination
}

// Teachers APIs
export async function getTeachers(page = 1): Promise<{
    teachers: Teachers[]
    pagination: Pagination
}> {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!BASE_URL) {
        throw new Error('NEXT_PUBLIC_BACKEND_URL not set')
    }

    const res = await fetch(`${BASE_URL}/teachers?page=${page}`, {
        credentials: 'include',
    })

    const json: TeachersResponse = await res.json()

    if (!res.ok || !json.success) {
        throw new Error(json?.message || 'Unable to fetch teachers')
    }

    return {
        teachers: json.data,
        pagination: json.pagination,
    }
}

export async function getTeacher(id: string) {
    return apiFetch<Teachers>(`/teachers/${id}`)
}

export type RegisterTeacherPayload = {
    name: string
    dob: string
    contact: string
    email: string
    address: string
    gender: 'Male' | 'Female' | 'Others'
    password: string
}

export async function registerTeacher(data: RegisterTeacherPayload) {
    const res = await fetch('/api/teachers/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    const json = await res.json()

    if (!res.ok || !json.success) {
        console.log('Register teacher validation errors:', json)
        throw new Error(json?.message || 'Failed to register teacher')
    }

    return json
}

export async function searchTeachers(search: string) {
    return apiFetch<Teachers[]>(
        `/teachers?search=${encodeURIComponent(search)}`
    )
}

export const getTeacherById = async (id: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    const res = await fetch(`${baseUrl}/teachers/${id}`, {
        credentials: "include",
    })

    if (!res.ok) {
        throw new Error("Failed to fetch teacher")
    }

    return res.json()
}

type UpdateTeacherPayload = {
    name: string
    email: string
    contact: string
    address: string
    gender: string
    imageUrl: string
    dob: string
    qualification: string
    teachingSince: number
}

export const updateTeacher = async (
    id: string,
    data: UpdateTeacherPayload
) => {
    const res = await fetch(`/api/teachers/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    const responseText = await res.text()

    if (!res.ok) {
        throw new Error(`Update failed: ${res.status} ${responseText}`)
    }

    return responseText ? JSON.parse(responseText) : null
}

export async function deleteTeacher(id: string) {
    const res = await fetch(`/api/teachers/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    })

    const json = await res.json()

    if (!res.ok || !json.success) {
        throw new Error(json?.message || 'Delete failed')
    }

    return json
}

export async function uploadTeachersCSV(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/teachers/bulk', {
        method: 'POST',
        credentials: 'include',
        body: formData,
    })

    const json = await res.json()

    if (!res.ok || !json.success) {
        throw new Error(json?.message || 'Bulk upload failed')
    }

    return json
}

export type TrainingResponse = {
    success: boolean,
    message: string,
    data: TrainingAttended[]
}

export const dummyTrainingAttended: TrainingAttended[] = [
    {
        id: 'TA-001',
        trainingEventId: 'TE-101',
        trainingName: 'Activity Based Learning Workshop',
        certificateNumber: 'CERT-ABL-2023-001',
        venue: 'Kathmandu Training Center',
        category: 'Pedagogy',
        description: 'DUMMY: Focused on activity-based teaching methods for primary students.',
        duration: '3 days',
        mentorsName: 'Dr. Ramesh Sharma',
        phase: 'Phase 1',
        sector: 'Education',
        rating: 4,
        refPhotos: null,
        startDate: '2023-05-10',
        teacherId: 'T-001',
        createdAt: '2023-05-15T10:00:00Z',
        updatedAt: '2023-05-15T10:00:00Z',
    },
    {
        id: 'TA-002',
        trainingEventId: 'TE-102',
        trainingName: 'Digital Teaching Tools Training',
        certificateNumber: 'CERT-DTT-2023-002',
        venue: 'Pokhara Learning Hub',
        category: 'Technology',
        description: 'DUMMY: Introduction to digital platforms and smart teaching tools.',
        duration: '5 days',
        mentorsName: 'Anita Karki',
        phase: 'Phase 2',
        sector: 'ICT in Education',
        rating: 5,
        refPhotos: 'https://example.com/photo1.jpg',
        startDate: '2023-07-01',
        teacherId: 'T-001',
        createdAt: '2023-07-06T09:30:00Z',
        updatedAt: '2023-07-06T09:30:00Z',
    },
    {
        id: 'TA-003',
        trainingEventId: 'TE-103',
        trainingName: 'Inclusive Education Training',
        certificateNumber: 'CERT-IET-2022-045',
        venue: 'Biratnagar Education Office',
        category: 'Special Education',
        description: 'DUMMY: Training on inclusive classrooms and supporting diverse learners.',
        duration: '2 days',
        mentorsName: 'Sita Gurung',
        phase: 'Phase 1',
        sector: 'Inclusive Education',
        rating: 3,
        refPhotos: null,
        startDate: '2022-11-20',
        teacherId: 'T-002',
        createdAt: '2022-11-22T08:15:00Z',
        updatedAt: '2022-11-22T08:15:00Z',
    },
    {
        id: 'TA-004',
        trainingEventId: 'TE-104',
        trainingName: 'Curriculum Development Workshop',
        certificateNumber: 'CERT-CDW-2024-010',
        venue: 'Lalitpur Resource Center',
        category: 'Curriculum',
        description: 'DUMMY: Advanced curriculum planning and assessment strategies.',
        duration: '4 days',
        mentorsName: 'Prof. Kiran Adhikari',
        phase: 'Phase 3',
        sector: 'Academic Development',
        rating: 5,
        refPhotos: 'https://example.com/photo2.jpg',
        startDate: '2024-02-12',
        teacherId: 'T-003',
        createdAt: '2024-02-16T11:00:00Z',
        updatedAt: '2024-02-16T11:00:00Z',
    }
]

export async function getTrainings(id: string): Promise<TrainingAttended[]> {
    try {
        const res = await fetch(`/api/training-records/teacher/${id}`, {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
        })

        const json: TrainingResponse = await res.json()

        if (!res.ok || !json.success) {
            console.warn('Training fetch failed:', json?.message)
            return dummyTrainingAttended
        }

        return json.data
    } catch (error) {
        console.error('Failed to fetch trainings:', error)
        return dummyTrainingAttended
    }
}

export type EventRecordsResponse = {
    success: boolean,
    message: string,
    data: EventRecords[]
}

export const dummyEventRecords: EventRecords[] = [
    {
        id: "DUMMY-EVT-001",
        teacherId: "DUMMY-TCH-001",
        eventType: "Conference",
        name: "[DUMMY] National Education Summit",
        roleAtEvent: "Speaker",
        startDate: "2025-01-10",
        duration: "2 days",
        refImage: "https://via.placeholder.com/150?text=DUMMY",
        organizer: "Dummy Organization",
        description: "This is a dummy conference event for testing.",
        createdAt: new Date().toISOString()
    },
    {
        id: "DUMMY-EVT-002",
        teacherId: "DUMMY-TCH-001",
        eventType: "Panel-Discussion",
        name: "[DUMMY] Future of Learning Panel",
        roleAtEvent: "Panelist",
        startDate: "2025-02-05",
        duration: "3 hours",
        refImage: "https://via.placeholder.com/150?text=DUMMY",
        organizer: "Mock Education Board",
        description: "Dummy panel discussion event.",
        createdAt: new Date().toISOString()
    },
    {
        id: "DUMMY-EVT-003",
        teacherId: "DUMMY-TCH-002",
        eventType: "Other",
        name: "[DUMMY] Workshop on Classroom Innovation",
        roleAtEvent: "Participant",
        startDate: "2025-03-15",
        duration: "1 day",
        refImage: "https://via.placeholder.com/150?text=DUMMY",
        organizer: "Test Institute",
        description: "Clearly marked dummy workshop data.",
        createdAt: new Date().toISOString()
    }
]

export async function getEventRecords(id: string): Promise<EventRecords[]> {
    return dummyEventRecords
}

export type CareerResponse = {
    success: boolean,
    message: string,
    data: Career[]
}

export const dummyCareer: Career[] = [
    {
        id: -1,
        designation: "[DUMMY] Junior Teacher",
        company: "Dummy High School",
        description: "Started teaching basic mathematics. This is dummy data.",
        startDate: { year: 2018 },
        endDate: { year: 2020 }
    },
    {
        id: -2,
        designation: "[DUMMY] Senior Teacher",
        company: "Mock Academy",
        description: "Handled senior classes and curriculum design. Dummy record.",
        startDate: { year: 2020, month: 6 },
        endDate: { year: 2022, month: 12 }
    },
    {
        id: -3,
        designation: "[DUMMY] Academic Coordinator",
        company: "Test Education Center",
        description: "Managed teaching staff and training programs. Dummy entry.",
        startDate: { year: 2023, month: 1 },
        endDate: "Present"
    },
    {
        id: -4,
        designation: "[DUMMY] Visiting Lecturer",
        company: "Placeholder College",
        description: "Part-time lectures on modern teaching methods.",
        startDate: { year: 2021, month: 3, day: 15 },
        endDate: { year: 2021, month: 9 }
    }
]

export async function getCareers(id: string): Promise<Career[]> {
    return dummyCareer
    // const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

    // if (!BASE_URL) {
    //     console.warn("BACKEND_URL not set, using dummy data")
    //     return dummyCareer
    // }

    // try {
    //     const res = await fetch(`${BASE_URL}/career-records/teacher/${id}`)

    //     if (!res.ok) 
    //         throw new Error(`HTTP error: ${res.status}`)

    //     const json: CareerResponse = await res.json()

    //     return json.data

    // } catch (error) {
    //     console.error("Failed to fetch careers:", error)
    //     return dummyCareer
    // }
}

// Get user by id
export async function getUser(id: number) {
    const res = await fetch(`${BASE_URL}/${id}`)

    if (!res.ok)
        throw new Error('Unable to fetch data')

    return res.json()
}