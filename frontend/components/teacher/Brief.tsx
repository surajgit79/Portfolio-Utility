import { MiniDetail } from "./MiniDetail"
import { H2, PG } from "../defaults/Typography"
import { getDOB } from "@/utils/GetDate"

type Props = {
    name: string,
    imageUrl: string,
    address: string,
    gender: string,
    school: string,
    qualification: string,
    dob: string,
}

export const BriefBlock = ({ name, imageUrl, address, gender, school, qualification, dob }: Props) => {
    return (
        <div className="w-full flex justify-center border my-5 py-10 rounded-lg bg-white">
            <div className="flex justify-around lg:gap-12 md:gap-4 sm:gap-4 gap-4 items-center md:flex-row flex-col">
                <img
                    src={imageUrl}
                    className="rounded-full h-40 w-40 object-cover border border-[#2D84C4]"
                    alt={name}
                />

                <div className="grid gap-4">
                    <div>
                        <H2
                            text={name}
                            classNames="!m-0 !text-center md:!text-left"
                        />
                        <PG
                            text={qualification}
                            classNames="!m-0 text-center md:!text-left"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-10 md:px-0">
                        <MiniDetail category="school" detail={school} />
                        <MiniDetail category="location" detail={address} />
                        <MiniDetail category="gender" detail={gender} />
                        <MiniDetail category="dob" detail={getDOB(dob)} />
                    </div>
                </div>
            </div>
        </div>
    )
}