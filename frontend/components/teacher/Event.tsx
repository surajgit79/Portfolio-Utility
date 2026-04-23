import { useEffect, useState } from "react"
import { HI, PG } from "../defaults/Typography"
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import type { EventRecords } from "@/types"
import { Button } from "../ui/button"
import { getEventRecords } from "@/lib/api"

type Props = {
    id: string,
    classNames: string,
}

export const EventBlock = ({ id, classNames }: Props) => {
    const [events, setEvents] = useState<EventRecords[]>([])
    useEffect(() => {
        getEventRecords(id).then(setEvents)
    }, [id])
    return (
        <div className={`${classNames}`}>
            <HI
                text="Events"
                classNames=""
                icon={<CalendarDaysIcon  className="h-7" />}
            />
            <div className="flex flex-col gap-4">
                <div className="bg-white shadow rounded-lg py-5 px-5 flex flex-col gap-3">
                    {events.map((event)=>(
                        <div key={event.id} className="flex flex-col gap p-1">
                            <PG
                                text={event.startDate}
                                classNames='!m-0 !p-0 !text-[#6334B1] !text-sm'
                            />
                            <PG
                                text={event.name}
                                classNames='!m-0 !p-0 !text-black font-medium'
                            />
                            <PG
                                text={event.organizer ?? 'Unknown'}
                                classNames='!m-0 !p-0 !text-[#717383] !text-sm'
                            />
                        </div>
                    ))}
                </div>
                {/* <Button className="bg-[#E9F4FC] text-md text-[#2D84C4] font-bold cursor-pointer">Show More &#9662;</Button> */}
            </div>
        </div>
    )
}