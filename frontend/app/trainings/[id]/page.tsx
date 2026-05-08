'use client'

import { H1, H2, H3, PG } from "@/components/defaults/Typography"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getTrainingById, downloadCertificate, viewCertificate } from "@/lib/api"
import { DownloadIcon, ViewIcon, Star } from "lucide-react"
import { getDOB } from "@/utils/GetDate"

type Skills = {
    id: string,
    name: string,
    program: string,
    module: string,
    unit: string
}

type Props = {
    id?: string,
    rating?: number,
    feedback?: string,
    trainingDate?: string,
    refPhotos?: string,
    certificateNumber?: string,
    createdAt?: string,
    updatedAt?: string,
    training?: {
        name?: string,
        program?: string,
        module?: string,
        unit?: string,
        venue?: string,
        description?: string,
        startDate?: string,
        mentorsName?: string
    },
    teacher?: {
        id?: string,
        name?: string,
        email?: string
    },
    skills?: Skills[]
}

export default function Training() {
    const router = useRouter()

    const { id } = useParams() as { id: string }

    const [data, setData] = useState<Props | null>(null)

    useEffect(() => {
        getTrainingById(id).then(setData)
    }, [id])

    if (!data) {
        return (
            <div>
                <H2
                    text="Training Data"
                    classNames="mt-5"
                />
                <PG
                    text={`Training record with id (${id}) was not found.`}
                    classNames="mt-2 border p-5 rounded-lg shadow-sm bg-[#FEFEFE]"
                />
            </div>
        )
    } else {


        const image = data.refPhotos || '/trainingDemo.jpg'

        const program = `${data.training?.program || 'N/A'} (${data.training?.module || 'N/A'}  | ${data.training?.unit || 'N/A'} )`

        return (
            <div className="mt-6 bg-white p-10 rounded-md shadow-sm border">
                <div className="flex justify-between items-start">
                    <H1
                        text="Training Details"
                        classNames="font-bold !text-3xl"
                    />
                    <div className="flex gap-3 items-center">
                        {/* <ViewIcon
                            className="text-[#2D84C4] cursor-pointer h-7 w-7"
                            onClick={async () => {
                                if (!data.certificateNumber) {
                                    alert('Certificate number not found')
                                    return
                                }

                                try {
                                    await viewCertificate(data.certificateNumber)
                                } catch (err) {
                                    alert(err instanceof Error ? err.message : 'View failed')
                                }
                            }}
                        /> */}
                        <DownloadIcon
                            className="text-[#2D84C4] cursor-pointer h-6 w-6"
                            onClick={async () => {
                                if (!data.certificateNumber) {
                                    alert('Certificate number not found')
                                    return
                                }

                                try {
                                    await downloadCertificate(data.certificateNumber)
                                } catch (err) {
                                    alert(err instanceof Error ? err.message : 'Download failed')
                                }
                            }}
                        />
                        <Button
                            className="bg-[#2D84C4] cursor-pointer"
                            onClick={() => router.back()}
                        >
                            Back
                        </Button>
                    </div>
                </div>

                <div className="flex justify-between">    
                    <H2
                        text={data.training?.name || 'DUMMY TITLE'}
                        classNames="font-medium"
                    />
                    <span>
                        Edit | Delete
                    </span>
                </div>                

                <div className="grid grid-cols-10 gap-5">
                    <div className="col-span-10">
                        <img
                            src={image}
                            className="object-cover w-full max-h-105 shadow-sm border rounded-sm"
                            alt={data.training?.name || 'Training image'}
                        />
                    </div>

                    <div className="col-span-10">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-3 bg-[#F0F9FF] p-5 mb-5 rounded-md shadow-md border">
                            <div className="flex flex-col">
                                <span className="text-[#AAAAAA] font-medium">
                                    Completed By:
                                </span>
                                <span className="text-black font-medium">
                                    {data.teacher?.name || 'N/A'}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-[#AAAAAA] font-medium">
                                    Mentored By:
                                </span>
                                <span className="text-black font-medium">
                                    {data.training?.mentorsName || 'N/A'}
                                </span>
                            </div>

                            <hr className="col-span-2 mt-2" />

                            <div className="flex flex-col">
                                <span className="text-[#AAAAAA] font-medium">
                                    Date:
                                </span>
                                <span className="text-black font-medium">
                                    {data.trainingDate ? getDOB(data.trainingDate) : 'N/A'}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-[#AAAAAA] font-medium">
                                    Venue:
                                </span>
                                <span className="text-black font-medium">
                                    {data.training?.venue || 'N/A'}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-[#AAAAAA] font-medium">
                                    Program:
                                </span>
                                <span className="text-black font-medium">
                                    {program}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-[#AAAAAA] font-medium">
                                    Certificate No:
                                </span>
                                <span className="text-black font-medium">
                                    {data.certificateNumber || 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-2">
                            <H3
                                text="Description"
                                classNames="font-bold mt-5"
                            />
                            <p className="mt-2 border p-5 rounded-lg shadow-sm bg-[#F0F9FF]">
                                {data.training?.description || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <H3
                        text="Skills"
                        classNames="font-bold mt-5 !mb-2"
                    />

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-2.5">
                        {data.skills && data.skills.length > 0 ? (
                            data.skills.map((skill) => (
                                <span
                                    key={skill.id}
                                    className="bg-[#F0F9FF] rounded-lg h-fit p-1 px-3 mr-1 my-2 text-black shadow-sm border"
                                >
                                    {skill.name}
                                </span>
                            ))
                        ) : (
                            <>
                                <span className="bg-[#F0F9FF] rounded-lg h-fit p-1 px-3 mr-1 my-2 text-black shadow-sm border">N/A</span>
                                <span className="bg-[#F0F9FF] rounded-lg h-fit p-1 px-3 mr-1 my-2 text-black shadow-sm border">N/A</span>
                                <span className="bg-[#F0F9FF] rounded-lg h-fit p-1 px-3 mr-1 my-2 text-black shadow-sm border">N/A</span>
                                <span className="bg-[#F0F9FF] rounded-lg h-fit p-1 px-3 mr-1 my-2 text-black shadow-sm border">N/A</span>
                            </>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between my-5">
                        <H3 text="Feedback" classNames="font-bold !mb-0" />
                        <p className="flex gap-1 justify-center align-center">
                            <Star fill={`#F5A641`} className=" cursor-pointer h-5 w-5" strokeWidth={1} stroke={`#303030`} />
                            {data.rating || 0}/5
                        </p>
                    </div>

                    <p className="mt-2 border p-5 rounded-lg shadow-sm bg-[#F0F9FF]">
                        {data.feedback || 'N/A'}
                    </p>
                </div>
            </div>
        )
    }
}