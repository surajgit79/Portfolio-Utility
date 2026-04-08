import type { Teachers, Training, Program, EventRecords, Career } from "@/types"

// Get all users
// export async function getUsers() {
//     const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
//     if (!BASE_URL)
//         throw new Error('BACKEND_URL not set')
//     const res = await fetch(BASE_URL)

//     if (!res.ok)
//         throw new Error('Unable to fetch data')

//     return res.json()
// }
export async function getUsers() {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!BASE_URL)
        throw new Error('BACKEND_URL not set')
    const res = await fetch(BASE_URL)

    if (!res.ok)
        throw new Error('Unable to fetch data')

    return res.json()
}

export type TeachersResponse = {
    success: boolean,
    message: string,
    data: Teachers[]
}

export async function getTeachers(): Promise<Teachers[]> {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!BASE_URL) 
        throw new Error('BACKEND_URL not set')

    const res = await fetch(`${BASE_URL}/teachers`)

    if (!res.ok)
        throw new Error('Unable to fetch data')

    const json: TeachersResponse = await res.json()

    return json.data
}

export async function getTeacher(id: string): Promise<Teachers> {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!BASE_URL)
        throw new Error('BACKEND_URL not set')

    const res = await fetch(`${BASE_URL}/teachers/${id}`)

    if (!res.ok)
        throw new Error('Unable to fetch data')

    const json = await res.json()
    console.log(json.data)

    return json.data
}

export type TrainingResponse = {
    success: boolean,
    message: string,
    data: Training[]
}

function getDummyTrainings(): Training[] {
    return [
        {
            id: -1,
            ref: "DUMMY-001",
            title: "[DUMMY] Activity Based Math Workshop",
            program: { book: 1, phase: 1 } as Program,
            description: "This is fallback dummy data. API failed."
        },
        {
            id: -2,
            ref: "DUMMY-002",
            title: "[DUMMY] Reading Enhancement Program",
            program: { book: 1, phase: 2 } as Program,
            description: "Dummy record for development/testing only."
        },
        {
            id: -3,
            ref: "DUMMY-003",
            title: "[DUMMY] Pre-School Teaching Training",
            program: { book: 1, phase: 3 } as Program,
            description: "Clearly marked dummy dataset."
        }
    ]
}

export async function getTrainings(id: string): Promise<Training[]> {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!BASE_URL) {
        console.warn("BACKEND_URL not set, using dummy data")
        return getDummyTrainings()
    }

    try {
        const res = await fetch(`${BASE_URL}/training-records/teacher/${id}`)

        if (!res.ok)
            throw new Error(`HTTP error: ${res.status}`)

        const json: TrainingResponse = await res.json()

        return json.data

    } catch (error) {
        console.error("Failed to fetch trainings:", error)
        return getDummyTrainings()
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
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!BASE_URL) {
        console.warn("BACKEND_URL not set, using dummy data")
        return dummyEventRecords
    }

    try {
        const res = await fetch(`${BASE_URL}/event-records/teacher/${id}`)

        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`)
        }

        const json: EventRecordsResponse = await res.json()

        return json.data

    } catch (error) {
        console.error("Failed to fetch events:", error)
        return dummyEventRecords
    }
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
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!BASE_URL) {
        console.warn("BACKEND_URL not set, using dummy data")
        return dummyCareer
    }

    try {
        const res = await fetch(`${BASE_URL}/career-records/teacher/${id}`)

        if (!res.ok) 
            throw new Error(`HTTP error: ${res.status}`)

        const json: CareerResponse = await res.json()

        return json.data

    } catch (error) {
        console.error("Failed to fetch careers:", error)
        return dummyCareer
    }
}

// Get user by id
export async function getUser(id: number) {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/' + id
    if (!BASE_URL)
        throw new Error('BACKEND_URL not set')
    const res = await fetch(BASE_URL)

    if (!res.ok)
        throw new Error('Unable to fetch data')

    return res.json()
}