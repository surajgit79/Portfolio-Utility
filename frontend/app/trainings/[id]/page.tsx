'use client'

import { H1, H3, PG } from "@/components/defaults/Typography"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"

export default function Training(){
    const params = useParams() as { id: string }
    const router = useRouter()
    return (
        <div className='mt-6 bg-white p-10 rounded-md'>
            <div className='flex justify-between items-start'>
                <H1
                    text="Training Details"
                    classNames="font-bold !text-3xl"
                />
                <Button className="bg-[#2D84C4]" onClick={(e) => router.back()}>Back</Button>
            </div>
            <H3
                text="Advanced AI & Machine Learning"
                classNames="font-medium"
            />
            <div className="grid grid-cols-10 gap-5">
                <div className="md:col-span-4 sm:col-span-10 col-span-10">
                    <img 
                        src='https://plus.unsplash.com/premium_photo-1664474653221-8412b8dfca3e?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        className="object-fit"    
                    />
                </div>
                <div className="md:col-span-6 sm:col-span-10 col-span-10">
                    <div className="grid grid-cols-2 gap-2 bg-[#F0F9FF] p-5 mb-5 rounded-md">
                        <div className="flex flex-col">
                            <span className="text-[#AAAAAA] font-medium">Date:</span>
                            <span className='text-black font-medium'>Aug, 2023</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#AAAAAA] font-medium">Venue:</span>
                            <span className='text-black font-medium'>Aug, 2023</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#AAAAAA] font-medium">Category:</span>
                            <span className='text-black font-medium'>Activity-based Mathematics</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#AAAAAA] font-medium">Phase:</span>
                            <span className='text-black font-medium'>Book 1 | Phase 1</span>
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-[#2D84C4] font-bold">Description</span>
                        <p className="mt-2">
                            Created a deep learning model for image recognition with 15% higher accuracy than top methods, using TensorFlow and a 1M-image dataset.                      
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <H3
                    text='Skills'
                    classNames="font-bold mt-5"
                />
                <div className="grid grid-cols-5 sm:grid-cols-2">
                    <span className="bg-[#F0F9FF] rounded-xl h-fit p-1 px-3 mr-1 my-2 text-black">Exploring Geometry</span>
                    <span className="bg-[#F0F9FF] rounded-xl h-fit p-1 px-3 mr-1 my-2 text-black">Exploring Geometry</span>
                    <span className="bg-[#F0F9FF] rounded-xl h-fit p-1 px-3 mr-1 my-2 text-black">Exploring Geometry</span>
                    <span className="bg-[#F0F9FF] rounded-xl h-fit p-1 px-3 mr-1 my-2 text-black">Exploring Geometry</span>
                    <span className="bg-[#F0F9FF] rounded-xl h-fit p-1 px-3 mr-1 my-2 text-black">Exploring Geometry</span>
                    <span className="bg-[#F0F9FF] rounded-xl h-fit p-1 px-3 mr-1 my-2 text-black">Exploring Geometry</span>
                </div>
            </div>
        </div>
    )
}