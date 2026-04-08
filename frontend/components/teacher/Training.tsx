import { HI, H3, PG } from "../defaults/Typography"
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { Button } from "../ui/button"
import { use, useEffect, useState } from "react"
import type { Training } from "@/types"
import { getTrainings } from "@/lib/api"

type Props = {
    id: string,
    classNames: string
}

export const TrainingBlock = ({ id, classNames }: Props) => {
    const [trainings, setTrainings] = useState<Training[]>([])

    useEffect(() => {
        getTrainings(id).then(res => setTrainings(Array.isArray(res) ? res : [res]))
    }, [id])

    return (
        <div className={classNames}>
            <div className="">
                <HI
                    text="Training"
                    classNames=""
                    icon={<ShieldCheckIcon className="h-7" />}
                />

                <div className="flex flex-col gap-5">
                    {
                        trainings.map((training) => (
                            <div key={training.id} className="bg-white border shadow rounded-lg px-10 py-5">
                                <div className="flex justify-between">
                                    <H3
                                        text={training.title}
                                        classNames="!p-0 !m-0 text-black"
                                    />
                                    <span>Aug, 2024</span>
                                </div>
                                <PG
                                    text={`Book ${training.program.book} | Phase ${training.program.phase}`}
                                    classNames="!m-0 !p-0 !text-[#555555]"
                                />
                                <PG
                                    text={training.description}
                                    classNames="!m-0 !p-0 !text-[#555555]"
                                />
                            </div>
                        ))
                    }
                <Button className="bg-[#E9F4FC] text-md text-[#2D84C4] font-bold cursor-pointer">Show More &#9662;</Button>
                </div>
            </div>

        </div>
    )
}