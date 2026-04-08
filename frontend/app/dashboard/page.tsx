'use client'

import { H1, H2, H3 } from "@/components/defaults/Typography"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import Link from "next/link"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import type { User, Users, Teachers } from "@/types"
import { getUsers, getTeachers } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Linker } from "@/utils/Linker"

function deleteUser(users: Users[], id: number) {
    const newUsers = users.filter((user) => Number(user.id) != id)
    // toast.info(`User (#${id}) has been deleted`)
    alert(`User (#${id}) has been deleted`)
    return newUsers
}

function deleteTeacher(teachers: Teachers[], id: number) {
    const newTeachers = teachers.filter((teacher) => Number(teacher.id) != id)
    return newTeachers
}

export default function Dashboard() {

    // const [users, setUsers] = useState<Users[]>([])
    const [teachers, setTeachers] = useState<Teachers[]>([])
    useEffect(() => {
        getTeachers().then(res => {
            setTeachers(res)
        })
    }, [])
    return (
        <div>
            <div className="flex items-center mt-10 mb-5 justify-between">
                <H1 text="Teacher Record Management" classNames="!m-0" />
                <Button className="bg-[#2D84C4] cursor-pointer" onClick={() => Linker({ link: '/teacher/add' })}>Add +</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Tenure</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teachers.map(({ id, userId, name, address, contact, email, gender, imageUrl, dob }: Teachers) => (
                        <TableRow key={id}>
                            <TableCell>{name}</TableCell>
                            <TableCell>N/A</TableCell>
                            <TableCell>N/A</TableCell>
                            <TableCell>N/A</TableCell>
                            <TableCell>{address}</TableCell>
                            <TableCell className="font-medium text-[#2D84C4]">
                                <Link className="hover:font-bold" href={`/teacher/${id}`}>View</Link> |
                                <Link className="hover:font-bold" href={`/teacher/${id}`}>Edit</Link> |
                                <Link className="hover:font-bold" href='#' onClick={() => setTeachers(deleteTeacher(teachers, Number(id)))}>Delete</Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}