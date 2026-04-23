import { useEffect, useState } from "react"
import { H1, H2, H3, HI, PG } from "../defaults/Typography"
import { BriefcaseIcon } from '@heroicons/react/24/outline'
import type { Career } from "@/types"
import { Button } from "../ui/button"
import { getCareers } from "@/lib/api"

type Props = {
    id: string,
    classNames: string
}

export const CareerBlock = ({id, classNames}: Props) => {
    const [careers, setCareers] = useState<Career[]>([])
    useEffect(() => {
        getCareers(id).then(setCareers)
    }, [id])
    return (
        <div className={`flex flex-col align-middle gap-4 ${classNames}`}>
            <HI
                text="Career"
                classNames=""
                icon={<BriefcaseIcon className="h-7"/>}
            />
            <div className="grid grid-cols-2 gap-3">
                {careers.map((career) => (
                    <div key={career.id} className="col-span-1 bg-white rounded-lg p-5 flex flex-col gap-2">
                        <div className="flex gap-2 justify-between items-baseline">
                            <H3 
                                text={career.designation}
                                classNames="!p-0 !m-0 !text-sm"
                            />
                            <PG
                                text={`${career.startDate.year} - ${career.endDate == 'Present' ? 'Present' : career.endDate.year}`}
                                classNames="!p-0 !m-0 !text-xs"
                            />
                        </div>
                        <H2
                            text={career.company}
                            classNames="!p-0 !m-0 text-[#6A31B8] !text-sm"
                        />
                        <PG
                            text={career.description}
                            classNames="!p-0 !m-0 !text-sm leading-[1.2]"
                        />
                    </div>
                ))}
            </div>
            {/* <Button className="bg-[#E9F4FC] text-[#2D84C4] text-md font-bold cursor-pointer">Show More &#9662;</Button> */}
        </div>
    )
}