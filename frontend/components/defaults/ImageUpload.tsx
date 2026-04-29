'use client'

import { useRef, useState } from 'react'
import { PG } from './Typography'

export default function ImageUpload({ onFileSelect }: { onFileSelect: (file: File) => void }) {
    const fileRef = useRef<HTMLInputElement | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)

    function handleClick() {
        fileRef.current?.click()
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0]
        if (!selected) return

        onFileSelect(selected)
        setPreview(URL.createObjectURL(selected))
    }

    return (
        <div
            className="col-span-10 md:col-span-2 flex justify-center md:justify-start"
        >
            <div
                className="relative h-[150] w-[150] shrink-0 cursor-pointer overflow-hidden rounded-full"
                onClick={handleClick}
            >
                <img
                    src={
                        preview ||
                        'https://m.media-amazon.com/images/S/aplus-media-library-service-media/365e5edb-7b7f-415a-81c7-a848936e9e38.__CR0,0,300,300_PT0_SX300_V1___.jpg'
                    }
                    className="h-full w-full object-cover"
                    alt="Preview"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <PG
                        text="UPLOAD IMAGE"
                        classNames="!m-0 !leading-none !font-medium"
                    />
                </div>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    className="hidden"
                    onChange={handleChange}
                />
            </div>
        </div>
    )
}