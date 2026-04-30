'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { H1, H3, PG } from "@/components/defaults/Typography"
import { CameraIcon } from '@heroicons/react/24/outline'
import { Input } from "@/components/ui/input"
import ImageUpload from '@/components/defaults/ImageUpload'
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"
import { useForm, Controller } from 'react-hook-form'
import { registerTeacher } from '@/lib/api'

type AddTeacherFormData = {
    name: string
    dob: string
    contact: string
    email: string
    address: string
    gender: 'Male' | 'Female' | 'Others'
    teachingSince?: string
    qualification?: string
}

export default function AddTeacher() {
    const router = useRouter()
    const [submitError, setSubmitError] = useState('')
    const [submitSuccess, setSubmitSuccess] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [teachingSince, setTeachingSince] = useState('')
    const [qualification, setQualification] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [preview, setPreview] = useState("")

    const form = useForm<AddTeacherFormData>({
        defaultValues: {
            name: 'Babu Ram',
            dob: '01-01-2000',
            contact: '9845000000',
            email: 'babu@gmail.com',
            address: 'Hetauda-4, Makawanpur, Nepal',
            gender: 'Male',
        },
    })

    const onSubmit = async (data: AddTeacherFormData) => {
        setSubmitError('')
        setSubmitSuccess('')
        setSubmitting(true)

        try {
            const res = await registerTeacher({
                name: data.name.trim(),
                dob: data.dob,
                contact: data.contact.trim(),
                email: data.email.trim(),
                address: data.address.trim(),
                gender: data.gender,
                password: 'Teacher1234',

                teachingSince: data.teachingSince
                    ? Number(data.teachingSince)
                    : undefined,

                qualification: data.qualification?.trim() || undefined,
                image: imageFile ?? undefined,
            })

            const teacherId = res?.data?.id

            if (!teacherId) {
                throw new Error('Teacher created but ID missing')
            }

            router.push(`/teachers/${teacherId}`)

        } catch (err: unknown) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to register teacher')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            <H1
                text="Teacher Profile"
                classNames="mt-10 font-bold"
            />

            <div className="grid grid-cols-10 gap-8 w-full items-center">

                <ImageUpload onFileSelect={setImageFile} />
                <div className="w-full col-span-10 md:col-span-8">
                    <H3
                        text="Basic Information"
                        classNames="font-bold"
                    />
                    <hr />

                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="grid grid-cols-2 bg-white p-5 mt-4 rounded-lg gap-4">

                            <Field>
                                <FieldLabel>Full Name</FieldLabel>
                                <Input
                                    placeholder="Enter full name"
                                    {...form.register('name')}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Date of Birth</FieldLabel>
                                <Input
                                    type="date"
                                    {...form.register('dob')}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Phone Number</FieldLabel>
                                <Input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    {...form.register('contact')}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Email</FieldLabel>
                                <Input
                                    type="email"
                                    placeholder="Enter email"
                                    {...form.register('email')}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Address</FieldLabel>
                                <Input
                                    placeholder="Enter address"
                                    {...form.register('address')}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Gender</FieldLabel>
                                <Select
                                    defaultValue="Male"
                                    onValueChange={(val) => form.setValue('gender', val as any)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Others">Others</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel>Teaching Since
                                    <FieldDescription>
                                        Optional
                                    </FieldDescription>
                                </FieldLabel>
                                <Input
                                    type="number"
                                    placeholder="e.g. 2015"
                                    {...form.register('teachingSince')}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Qualification
                                    <FieldDescription>
                                        Optional
                                    </FieldDescription>
                                </FieldLabel>
                                <Input
                                    placeholder="e.g. MSc. Computer Science"
                                    {...form.register('qualification')}
                                />

                            </Field>

                        </FieldGroup>

                        {submitError ? (
                            <p className="mt-4 text-sm text-red-600">{submitError}</p>
                        ) : null}

                        {submitSuccess ? (
                            <p className="mt-4 text-sm text-green-600">{submitSuccess}</p>
                        ) : null}

                        <div className="mt-6 flex justify-start">
                            <Button type="submit" disabled={submitting} className='h-9 bg-[#2D84C4]'>
                                {submitting ? 'Adding...' : 'Add Teacher'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}