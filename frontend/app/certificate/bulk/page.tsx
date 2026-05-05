'use client'

import { useEffect, useState } from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { downloadBulkCertificates, getTrainingEvents } from "@/lib/api"
import { getMY } from '@/utils/GetDate'

type TrainingEvent = {
    id: string
    name: string
    program: string
    module: string
    unit: string
    startDate: string
}

export default function BulkCertificate() {
    const [trainings, setTrainings] = useState<TrainingEvent[]>([])
    const [selectedTrainingId, setSelectedTrainingId] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [downloading, setDownloading] = useState(false)

    useEffect(() => {
        async function fetchTrainings() {
            try {
                setLoading(true)
                const data = await getTrainingEvents()
                setTrainings(data)
            } catch (error) {
                console.error('Failed to fetch training events:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchTrainings()
    }, [])

    async function handleDownload() {
        if (!selectedTrainingId) return

        try {
            setDownloading(true)
            await downloadBulkCertificates(selectedTrainingId)
        } catch (error) {
            console.error('Bulk certificate download failed:', error)
        } finally {
            setDownloading(false)
        }
    }

    return (
        <div className="bg-white p-5 mt-10 rounded-lg shadow-lg flex gap-2">
            <Select
                value={selectedTrainingId}
                onValueChange={setSelectedTrainingId}
                disabled={loading}
            >
                <SelectTrigger className="w-full max-w-80">
                    <SelectValue placeholder={loading ? "Loading trainings..." : "Select training"} />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Training Events</SelectLabel>

                        {trainings.map((training) => (
                            <SelectItem key={training.id} value={training.id}>
                                {`${training.name} (${getMY(training.startDate)})`}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Button
                className="bg-[#2D84C4]"
                onClick={handleDownload}
                disabled={!selectedTrainingId || downloading}
            >
                {downloading ? "Downloading..." : "Download Bulk"}
            </Button>
        </div>
    )
}