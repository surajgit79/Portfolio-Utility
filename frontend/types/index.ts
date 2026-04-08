type BuildRange<N extends number, Result extends number[] = []> 
    = Result['length'] extends N ? Result[number] : BuildRange<N, [...Result, Result['length']]>

type Range<F extends number, T extends number> =
    Exclude<BuildRange<T>, BuildRange<F>> | F

type Month = Range<1, 13>
type Day = Range<1, 32>

export type CustomDate = | { year: number } | { year: number; month: Month } | { year: number; month: Month; day: Day }

export type Training = {
    id: number,
    ref: string,
    title: string,
    program: Program,
    description: string,
}

export type Career = {
    id: number,
    designation: string,
    company: string,
    description: string,
    startDate: CustomDate,
    endDate: CustomDate | 'Present'
}

export type Program = {
    book: number,
    phase: number,
}

export type User = {
    id: number,
    name: string,
    school: string,
    department: string,
    gender: "Male" | "Female" | "Other",
    dob: CustomDate,
    grade: number,
    program: Program[],
    tenure: number,
    address: {
        city: string
    },
    company: {
        name: string
    }
    careers: Career[],
}

export type Users = {
    id: string,
    email: string,
    password: string,
    role: 'admin' | 'teacher',
    createdAt: string,
    updatedAt: string,
}

export type Teachers = {
    id: string,
    userId: string,
    name: string,
    address: string,
    contact: string,
    email: string,
    gender: 'Male' | 'Female' | 'Others',
    imageUrl: string,
    dob: string,
    createdAt: string,
    updatedAt: string,
}

export type TrainingEvents = {
    id: string,
    category: 'Activity-based Mathematics' | 'Pre-School' | 'Reading',
    sector: string,
    _phase: string,
    name: string,
    _mentorsName: string,
    _venue: string,
    startDate: string,
    duration: string,
    _description: string,
    createdAt: string,
    updatedAt: string,
}

export type TrainingRecords = {
    id: string,
    teacherId: string,
    trainingEventId: string,
    rating: number,
    certificateNumber: string,
    _refPhotos: string,
    createdAt: string,
    updatedAt: string,
}

export type CareerRecords = {
    id: string,
    teacherId: string,
    role: string,
    organization: string,
    startDate: string,
    _endDate: string,
    stillWorking: 0 | 1,
    _achievements: string
    _refContactDetail: string,
    createdAt: string
}

export type EventRecords = {
    id: string
    teacherId: string
    eventType: 'Conference' | 'Panel-Discussion' | 'Other'
    name: string
    roleAtEvent: string
    startDate: string
    duration: string
    refImage?: string
    organizer?: string
    description?: string
    createdAt: string
}