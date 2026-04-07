'use client';

import { DefaultButton } from "./DefaultButton"
import { Linker } from "@/utils/Linker"

export const Navbar = () => {
    return (
        <div 
            className="flex w-full items-center align-middle border justify-around bg-[#F0F9FF]"
        >
            <div>
                <img 
                    src='/logo.svg'
                    className="h-18 my-5 cursor-pointer"
                    onClick={() => Linker({ link: '/dashboard' })}
                />
            </div>
            {/* <div className="flex gap-3">
                <DefaultButton text='Add Teacher'/>
                <DefaultButton text='Add Training/Events'/>
            </div> */}
        </div>
    )
}