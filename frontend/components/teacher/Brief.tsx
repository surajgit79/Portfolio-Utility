import { MiniDetail } from "./MiniDetail"
import { H2, PG } from "../defaults/Typography"
import { getDOB } from "@/utils/GetDate"
import { useRouter } from "next/navigation"
import { PencilSquareIcon } from '@heroicons/react/24/outline'

type Props = {
    id: string,
    name?: string,
    imageUrl?: string,
    address?: string,
    gender?: string,
    school?: string,
    qualification?: string,
    dob?: string,
    email?: string,
    contact?: string
}

export const BriefBlock = ({ id, name, imageUrl, address, gender, school, qualification, dob, email, contact }: Props) => {
    const router = useRouter()
    return (
        <div className="w-full flex justify-center border my-5 py-10 rounded-lg bg-white">
            <div className="flex justify-around lg:gap-12 md:gap-4 sm:gap-4 gap-4 items-center md:flex-row flex-col">
                <img
                    src={imageUrl}
                    className="rounded-full h-40 w-40 object-cover border border-[#2D84C4]"
                    alt={name}
                />

                <div className="grid gap-4">
                    <div className="relative">
                        <H2
                            text={name || ''}
                            classNames="!m-0 !text-center md:!text-left"
                        />
                        <PencilSquareIcon
                            onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/teachers/${id}/edit`)
                            }}
                            className='text-[#2D84C4] absolute right-0 top-0 h-6 w-6 cursor-pointer'
                        />

                        <PG
                            text={qualification || ''}
                            classNames="!m-0 text-center md:!text-left"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-5 gap-x-8 md:px-0">
                        <MiniDetail category="school" detail={school || ''} />
                        <MiniDetail category="location" detail={address || ''} />
                        <MiniDetail category="email" detail={email || ''} />
                        <MiniDetail category="contact" detail={contact || ''} />
                        <MiniDetail category="gender" detail={gender || ''} />
                        <MiniDetail category="dob" detail={getDOB(dob || '')} />
                    </div>
                </div>
            </div>
        </div>
    )
}