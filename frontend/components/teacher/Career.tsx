import { useEffect, useState } from "react"
import { H1, H2, H3, HI, PG } from "../defaults/Typography"
import { BriefcaseIcon } from '@heroicons/react/24/outline'
import type { Career } from "@/types"
import { Button } from "../ui/button"
import { getCareers } from "@/lib/api"

type Props = {
    id: string,
    classNames: string
    tenure: number
}

export const CareerBlock = ({ id, classNames, tenure }: Props) => {
    const [careers, setCareers] = useState<Career[]>([])
    useEffect(() => {
        async function fetchCareers() {
            try {
                const res = await getCareers(id)

                if (!res || (Array.isArray(res) && res.length === 0)) {
                    setCareers([])
                } else if (Array.isArray(res)) {
                    setCareers(res)
                } else {
                    setCareers([res])
                }
            } catch (error) {
                console.error("Failed to fetch careers:", error)
                setCareers([])
            }
        }

        fetchCareers()
    }, [id])
    return (
        <div className={`flex flex-col align-middle gap-4 ${classNames}`}>
            <div className="flex justify-between ">
                <HI
                    text="Career"
                    classNames=""
                    icon={<BriefcaseIcon className="h-7" />}
                />
                <span>
                    {tenure > 1 ? `${tenure} years` : tenure == 1 ? `${tenure} year` : '< 1 year'}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {careers.length === 0 ? (
                    <div className="col-span-2 bg-white rounded-lg shadow-sm px-10 py-8 text-center">
                        <PG
                            text="No career records found."
                            classNames="text-gray-500"
                        />
                    </div>
                ) : (
                    careers.map((career) => (
                        <div
                            key={career.id}
                            className="bg-white rounded-lg flex flex-col gap-2 col-span-2 md:col-span-1 shadow-sm px-10 py-8 cursor-not-allowed"
                        >
                            <div className="flex gap-2 justify-between items-baseline">
                                <H3
                                    text={career.designation}
                                    classNames="!p-0 !m-0 !text-sm"
                                />

                                <PG
                                    text={`${career.startDate.year} - ${career.endDate === "Present"
                                        ? "Present"
                                        : career.endDate.year
                                        }`}
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
                    ))
                )}
            </div>
            {/* <Button className="bg-[#E9F4FC] text-[#2D84C4] text-md font-bold cursor-pointer">Show More &#9662;</Button> */}
        </div>
    )
}