'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { H1, H3, PG } from "@/components/defaults/Typography"
import { CameraIcon } from '@heroicons/react/24/outline'
import { Input } from "@/components/ui/input"
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
}

export default function AddTeacher() {
    const router = useRouter()
    const [submitError, setSubmitError] = useState('')
    const [submitSuccess, setSubmitSuccess] = useState('')
    const [submitting, setSubmitting] = useState(false)

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
            await registerTeacher({
                ...data,
                password: 'Pass1234',
            })

            setSubmitSuccess('Teacher registered successfully')
            form.reset({
                name: 'Babu Ram',
                dob: '01-01-2000',
                contact: '9845000000',
                email: 'babu@gmail.com',
                address: 'Hetauda-4, Makawanpur, Nepal',
                gender: 'Male',
            })

            router.refresh()
        } catch (err: unknown) {
            if (err instanceof Error) {
                setSubmitError(err.message)
            } else {
                setSubmitError('Failed to register teacher')
            }
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
                <div className="col-span-10 md:col-span-2 relative">
                    <img
                        src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/365e5edb-7b7f-415a-81c7-a848936e9e38.__CR0,0,300,300_PT0_SX300_V1___.jpg"
                        className="rounded-full z-0 w-full max-w-55 mx-auto"
                        alt="Teacher placeholder"
                    />
                    <div className="absolute inset-0 bg-white rounded-full z-1 opacity-70 flex flex-col justify-center items-center w-full max-w-55 mx-auto">
                        <CameraIcon className="w-20" />
                        <PG
                            text="UPLOAD IMAGE"
                            classNames="!m-0 !leading-none !not-first:mt-0"
                        />
                    </div>
                </div>

                <div className="w-full col-span-10 md:col-span-8">
                    <H3
                        text="Basic Information"
                        classNames="font-bold"
                    />
                    <hr />

                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 mt-4 rounded-lg">
                            <Field>
                                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                <Input
                                    id="name"
                                    placeholder="Enter full name"
                                    className="h-10"
                                    {...form.register('name', { required: 'Full name is required' })}
                                />
                                <FieldDescription>
                                    {form.formState.errors.name?.message}
                                </FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
                                <Input
                                    id="dob"
                                    type="date"
                                    className="h-10"
                                    {...form.register('dob', { required: 'Date of birth is required' })}
                                />
                                <FieldDescription>
                                    {form.formState.errors.dob?.message}
                                </FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="contact">Phone Number</FieldLabel>
                                <Input
                                    id="contact"
                                    type="tel"
                                    placeholder="Enter phone number"
                                    className="h-10"
                                    {...form.register('contact', { required: 'Phone number is required' })}
                                />
                                <FieldDescription>
                                    {form.formState.errors.contact?.message}
                                </FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter email"
                                    className="h-10"
                                    {...form.register('email', { required: 'Email is required' })}
                                />
                                <FieldDescription>
                                    {form.formState.errors.email?.message}
                                </FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="address">Address</FieldLabel>
                                <Input
                                    id="address"
                                    placeholder="Enter address"
                                    className="h-10"
                                    {...form.register('address', { required: 'Address is required' })}
                                />
                                <FieldDescription>
                                    {form.formState.errors.address?.message}
                                </FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="gender">Gender</FieldLabel>
                                <Controller
                                    control={form.control}
                                    name="gender"
                                    rules={{ required: 'Gender is required' }}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger id="gender" className="h-10 min-h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Others">Others</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FieldDescription>
                                    {form.formState.errors.gender?.message}
                                </FieldDescription>
                            </Field>
                        </FieldGroup>

                        {submitError ? (
                            <p className="mt-4 text-sm text-red-600">{submitError}</p>
                        ) : null}

                        {submitSuccess ? (
                            <p className="mt-4 text-sm text-green-600">{submitSuccess}</p>
                        ) : null}

                        <div className="mt-6 flex justify-start">
                            <Button type="submit" disabled={submitting} className='h-8 bg-[#2D84C4]'>
                                {submitting ? 'Saving...' : 'Save Teacher'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}