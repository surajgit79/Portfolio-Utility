'use client'

import { useParams } from "next/navigation"
import { getTeacher } from "@/lib/api"
import { useState, useEffect } from "react"
import type { Teachers } from "@/types"
import { BriefBlock } from "@/components/teacher/Brief"
import { TrainingBlock } from "@/components/teacher/Training"
import { EventBlock } from "@/components/teacher/Event"
import { CareerBlock } from "@/components/teacher/Career"

export default function Teacher() {
    const params = useParams() as { id: string }

    const [teacher, setTeacher] = useState<Teachers>()

    useEffect(() => {
        getTeacher(params.id).then(res => setTeacher(res))
    }, [params.id])

    return (
        <div>
            <BriefBlock
                id={params.id}
                name={teacher?.name ?? 'NO NAME'}
                imageUrl={
                    teacher?.imageUrl ??
                    '/profilePlaceholder.jpg'
                }
                qualification={teacher?.qualification ?? "N/A"}
                school={teacher?.currentOrganization ?? 'N/A'}
                address={teacher?.address ?? 'N/A'}
                gender={teacher?.gender ?? 'N/A'}
                dob={teacher?.dob ?? 'N/A'}
                email={teacher?.email ?? 'N/A'}
                contact={teacher?.contact ?? 'N/A'}
            />

            <div className="grid grid-cols-10 gap-5">
                <div className="col-span-10 lg:col-span-7 flex flex-col gap-8">
                    <TrainingBlock id={params.id} classNames="" />
                    <CareerBlock id={params.id} classNames="" tenure={teacher?.tenure || 0}/>
                </div>

                <div className="col-span-10 lg:col-span-3">
                    <EventBlock id={params.id} classNames="" />
                </div>
            </div>
        </div>
    )
}