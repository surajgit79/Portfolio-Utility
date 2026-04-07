import { H1, H3, H5, PG } from "@/components/defaults/Typography"
import { CameraIcon } from '@heroicons/react/24/outline'
import { Input } from "@/components/ui/input"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
export default function AddTeacher() {
    return (
        <div>
            <H1
                text="Teacher Profile"
                classNames="mt-10 font-bold"
            />
            <div className="grid grid-cols-10 gap-8 w-full items-center">
                <div className='col-span-2 relative'>
                    <img
                        src='https://m.media-amazon.com/images/S/aplus-media-library-service-media/365e5edb-7b7f-415a-81c7-a848936e9e38.__CR0,0,300,300_PT0_SX300_V1___.jpg'
                        className="rounded-[100%] z-0"
                    />
                    <div className="absolute inset-0 bg-white rounded-[100%] z-1 opacity-70 flex flex-col justify-center items-center">
                        <CameraIcon
                            className='w-20'
                        />
                        <PG
                            text="UPLOAD IMAGE"
                            classNames="!m-0 !leading-none !not-first:mt-0"
                        />
                    </div>
                </div>
                <div className="w-full col-span-8">
                    <H3
                        text="Basic Information"
                        classNames="font-medium"
                    />
                    <hr />
                    <FieldGroup className="grid grid-cols-2 bg-white p-5 mt-4 rounded-lg">
                        <Field>
                            <FieldLabel htmlFor="fieldgroup-name">Full Name</FieldLabel>
                            <Input id="fieldgroup-name" placeholder="Enter full name" className="h-10"/>
                            <FieldDescription></FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="fieldgroup-dob">Date of Birth</FieldLabel>
                            <Input id="fieldgroup-dob" type="date" className="h-10"/>
                            <FieldDescription></FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="fieldgroup-tel">Phone Number</FieldLabel>
                            <Input id="fieldgroup-tel" type="tel" placeholder="Enter phone number" className="h-10"/>
                            <FieldDescription></FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                            <Input
                                id="fieldgroup-email"
                                type="email"
                                placeholder="name@example.com"
                                className="h-10"
                            />
                            <FieldDescription></FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="fieldgroup-address">Address</FieldLabel>
                            <Input id="fieldgroup-address" placeholder="Enter address" className="h-10"/>
                            <FieldDescription></FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="form-gender">Gender</FieldLabel>
                            <Select defaultValue="Male">
                                <SelectTrigger id="form-gender" className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Others">Others</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>

                </div>
            </div>
        </div>
    )
}