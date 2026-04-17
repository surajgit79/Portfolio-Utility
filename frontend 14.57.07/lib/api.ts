import type { Teachers, Training, Program, EventRecords, Career, TrainingAttended } from "@/types"

export type TeachersResponse = {
    success: boolean,
    message: string,
    data: Teachers[]
}

export async function getTeachers(): Promise<Teachers[]> {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!BASE_URL) {
        throw new Error('NEXT_PUBLIC_BACKEND_URL not set')
    }

    try {
        const res = await fetch(`${BASE_URL}/teachers`)

        if (!res.ok) {
            throw new Error(`Unable to fetch data: ${res.status}`)
        }

        const json: TeachersResponse = await res.json()
        return json.data
    } catch (error) {
        console.error('Fetch teachers failed:', error)
        throw error
    }
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
        description: 'Focused on activity-based teaching methods for primary students.',
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
        description: 'Introduction to digital platforms and smart teaching tools.',
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
        description: 'Training on inclusive classrooms and supporting diverse learners.',
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
        description: 'Advanced curriculum planning and assessment strategies.',
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
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!BASE_URL) {
        console.warn("BACKEND_URL not set, using dummy data")
        return dummyTrainingAttended
    }

    try {
        const res = await fetch(`${BASE_URL}/training-records/teacher/${id}`)

        if (!res.ok){
            return dummyTrainingAttended
            // throw new Error(`HTTP error: ${res.status} ...`)
        }

        const json: TrainingResponse = await res.json()
        console.log(json.data)
        return json.data

    } catch (error) {
        console.error("Failed to fetch careers:", error)
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
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/' + id
    if (!BASE_URL)
        throw new Error('BACKEND_URL not set')
    const res = await fetch(BASE_URL)

    if (!res.ok)
        throw new Error('Unable to fetch data')

    return res.json()
}