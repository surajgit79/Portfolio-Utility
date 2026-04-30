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
        <div className={`${classNames} cursor-not-allowed`}>
            <HI
                text="Events"
                classNames=""
                icon={<CalendarDaysIcon  className="h-7" />}
            />
            <div className="flex flex-col gap-4 shadow-sm">
                <div className="bg-white shadow rounded-lg py-5 px-5 pl-10 flex flex-col">
                    {events.map((event)=>(
                        <div key={event.id} className="flex flex-col gap pl-10 pb-5 border-l-5 border-[#D7D5F5] relative">
                            <span className="h-4 w-4 bg-white ring-2 ring-[#6334B1] rounded-full absolute -left-2.5 top-0 "/>
                            <PG
                                text={event.startDate}
                                classNames='!m-0 !p-0 !text-[#6334B1] !text-sm font-bold'
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