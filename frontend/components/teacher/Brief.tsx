import { MiniDetail } from "./MiniDetail"
import { H2, PG } from "../defaults/Typography"
import { getDOB } from "@/utils/GetDate"

type Props = {
    name: string,
    imageUrl: string,
    address: string,
    gender: string,
    school: string,
    department: string,
    dob: string,
}

export const BriefBlock = ({ name, imageUrl, address, gender, school, department, dob }: Props) => {
    return (
        <div className="w-full flex justify-center border my-5 py-10 rounded-lg bg-white">
            <div className="flex gap-12 items-center">
                <img
                    src={imageUrl}
                    className="rounded-[100%] h-40 w-40 object-cover"
                />
                <div className="grid gap-4">
                    <div>
                        <H2
                            text={name}
                            classNames='!m-0'
                        />
                        <PG
                            text={department}
                            classNames="!m-0"
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-4 gap-x-30'>
                        <MiniDetail
                            category="school"
                            detail={school}
                        />
                        <MiniDetail
                            category="location"
                            detail={address}
                        />
                        <MiniDetail
                            category="gender"
                            detail={gender}
                        />
                        <MiniDetail
                            category="dob"
                            detail={getDOB(dob)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}