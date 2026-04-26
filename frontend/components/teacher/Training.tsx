import { HI, H3, PG } from "../defaults/Typography"
import { ShieldCheckIcon } from "@heroicons/react/24/outline"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import type { TrainingAttended } from "@/types"
import { getTrainings } from "@/lib/api"
import { getMY } from "@/utils/GetDate"
import { useRouter } from "next/navigation"

type Props = {
    id: string
    classNames: string
}

const STEP = 2

export const TrainingBlock = ({ id, classNames }: Props) => {
    const [trainings, setTrainings] = useState<TrainingAttended[]>([])
    const [visibleCount, setVisibleCount] = useState(STEP)

    const router = useRouter()

    const categoryColors: Record<string, string> = {
        "Reading & Language": "text-green-700",
        "Pre-School Transformation": "text-red-600",
        "Activity-based Mathematics": "text-yellow-700",
    }

    useEffect(() => {
        getTrainings(id).then((res) =>
            setTrainings(Array.isArray(res) ? res : [res])
        )
    }, [id])

    return (
        <div className={classNames}>
            <HI
                text="Training"
                classNames=""
                icon={<ShieldCheckIcon className="h-7" />}
            />

            <div className="flex flex-col gap-0">
                {trainings.slice(0, visibleCount).map((training) => (
                    <div
                        key={training.id}
                        className="bg-white border shadow rounded-lg px-10 py-5 flex gap-5 my-2 cursor-pointer"
                        onClick={() => router.push(`/trainings/${training.id}`)}
                    >
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between">
                                <H3
                                    // text={training.category === 'Activity-based Mathematics' ? `${training.sector} | ${training.phase}`: training.sector}
                                    text={training.trainingName}
                                    classNames="!p-0 !m-0 text-black"
                                />

                                <span>{getMY(training.startDate)}</span>
                            </div>

                            <div>
                                <PG
                                    // text={training.category}
                                    text={training.program}
                                    classNames={`!m-0 !p-0 ${
                                        categoryColors[training.program] ||
                                        "text-gray-600"
                                    }`}
                                />

                                <PG
                                    text={training.description}
                                    classNames="!m-0 !p-0 !text-[#555555]"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex gap-3 mt-3">
                    {visibleCount < trainings.length && (
                        <Button
                            className="bg-[#E9F4FC] text-md text-[#2D84C4] font-bold cursor-pointer"
                            onClick={() =>
                                setVisibleCount((prev) => prev + STEP)
                            }
                        >
                            Show More &#9662;
                        </Button>
                    )}

                    {visibleCount > STEP && (
                        <Button
                            className="bg-gray-200 text-md text-gray-700 font-bold cursor-pointer"
                            onClick={() =>
                                setVisibleCount((prev) =>
                                    Math.max(STEP, prev - STEP)
                                )
                            }
                        >
                            Show Less &#9652;
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}