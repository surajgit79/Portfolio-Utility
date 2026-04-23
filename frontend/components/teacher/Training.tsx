import { HI, H3, PG } from "../defaults/Typography"
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import type { TrainingAttended } from "@/types"
import { getTrainings } from "@/lib/api"
import { getMY } from "@/utils/GetDate"
import { useRouter } from "next/navigation"

type Props = {
    id: string,
    classNames: string
}

export const TrainingBlock = ({ id, classNames }: Props) => {
    const [trainings, setTrainings] = useState<TrainingAttended[]>([])
    const router = useRouter()

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
                            <div key={training.id} 
                                className="bg-white border shadow rounded-lg px-10 py-5 flex gap-5 my-2 cursor-pointer"
                                onClick={() => {
                                    router.push(`/trainings/${training.id}`)
                                }}
                            >
                                <div className='w-40'>
                                    <img src="https://plus.unsplash.com/premium_photo-1664474653221-8412b8dfca3e?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Training Image"/>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="flex justify-between">
                                        <H3
                                            text={training.category}
                                            classNames="!p-0 !m-0 text-black"
                                        />
                                        <span>
                                            {`${getMY(training.startDate)}`}
                                        </span>
                                    </div>
                                    <div>
                                        <PG
                                            text={`${training.sector} | ${training.phase}`}
                                            classNames="!m-0 !p-0 !text-[#555555]"
                                        />
                                        <PG
                                            text={training.description}
                                            classNames="!m-0 !p-0 !text-[#555555]"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                {/* <Button className="bg-[#E9F4FC] text-md text-[#2D84C4] font-bold cursor-pointer">Show More &#9662;</Button> */}
                </div>
            </div>

        </div>
    )
}