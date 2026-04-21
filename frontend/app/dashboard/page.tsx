'use client'

import { H1, H2, H3 } from "@/components/defaults/Typography"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import Link from "next/link"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import type { Users, Teachers } from "@/types"
import { getTeachers } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Linker } from "@/utils/Linker"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"

function deleteUser(users: Users[], id: number) {
    const newUsers = users.filter((user) => Number(user.id) != id)
    // toast.info(`User (#${id}) has been deleted`)
    alert(`User (#${id}) has been deleted`)
    return newUsers
}

function deleteTeacher(teachers: Teachers[], id: string) {
    return teachers.filter((teacher) => teacher.id !== id)
}

export default function Dashboard() {
    const router = useRouter()
    const [teachers, setTeachers] = useState<Teachers[]>([])
    useEffect(() => {
        getTeachers(1).then(res => {
            setTeachers(res)
        })
    }, [])
    return (
        <div className="bg-white p-5 mt-10 rounded-lg">
            <div className="flex items-center my-5 justify-between">
                <H1 text="Teacher Record Management" classNames="!m-0" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-[#2D84C4] text-white cursor-pointer" onClick={() => Linker({ link: '/teacher/add' })}>Add +</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Teacher</DropdownMenuLabel>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/teacher/add')}>Individual</DropdownMenuItem>
                            <DropdownMenuItem onClick={()=> router.push('teacher/add/bulk')}>Bulk</DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                            {/* <DropdownMenuLabel>Trainings & Events</DropdownMenuLabel> */}
                            <DropdownMenuItem>Trainings</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="bg-[#E6F4FF]">
                        <TableHead>Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Tenure</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teachers.map(({ id, userId, name, address, contact, email, tenure, gender, imageUrl, dob }: Teachers, index) => (
                        <TableRow
                            key={id}
                            onClick={() => router.push(`/teacher/${id}`)}
                            className={`cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-blue-50 transition-colors`}
                        >
                            <TableCell>{name}</TableCell>
                            <TableCell>N/A</TableCell>
                            <TableCell>N/A</TableCell>
                            <TableCell>{tenure < 1 ? '<1 year' : tenure === 1 ? '1 year': `${tenure} years`}</TableCell>
                            <TableCell>{address}</TableCell>

                            <TableCell className="font-medium text-[#2D84C4]">
                                <Link
                                    className="hover:font-bold"
                                    href={`/teacher/${id}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View
                                </Link>{' '}
                                |{' '}
                                <Link
                                    className="hover:font-bold"
                                    href={`/teacher/${id}/edit`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Edit
                                </Link>{' '}
                                |{' '}
                                <button
                                    type="button"
                                    className="hover:font-bold cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setTeachers(deleteTeacher(teachers, id))
                                    }}
                                >
                                    Delete
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}