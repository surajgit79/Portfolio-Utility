'use client'

import { useParams } from "next/navigation"
import { getUser } from "@/lib/api"
import { useState, useEffect } from "react"
import type { User } from "@/types"
import { H2, PG } from "@/components/defaults/Typography"
import { MiniDetail } from "@/components/teacher/MiniDetail"
import { getRandom } from '@/utils/Random'

const gender = ['Male', 'Female', 'Other']

export default function Teacher() {
    const params = useParams() as { id: string }

    const [user, setUser] = useState<User>()

    useEffect(() => {
        getUser(Number(params.id)).then(setUser)
    }, [params.id])

    return (
        <div className="w-full flex justify-center border my-5 py-10 rounded-lg bg-white">
            <div className="flex gap-12 items-center">
                <img
                    src='https://m.media-amazon.com/images/S/aplus-media-library-service-media/365e5edb-7b7f-415a-81c7-a848936e9e38.__CR0,0,300,300_PT0_SX300_V1___.jpg'
                    className="rounded-[100%] h-40"
                />
                <div className="grid gap-4">
                    <div>
                        <H2
                            text={user?.name || ""}
                            classNames='!m-0'
                        />
                        <PG
                            text='Computer Science'
                            classNames="!m-0"
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-4 gap-x-30'>
                        <MiniDetail
                            category="school"
                            detail={typeof user?.company === 'string' ? user.company : user?.company?.name || ""}
                        />
                        <MiniDetail
                            category="location"
                            detail={typeof user?.address === 'string' ? user.address : user?.address?.city || ""}
                        />
                        <MiniDetail
                            category="gender"
                            detail='Male'
                        />
                        <MiniDetail
                            category="dob"
                            detail="2024/01/01"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}