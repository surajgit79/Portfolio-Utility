'use client'

import { H1, H2, H3 } from "@/components/defaults/Typography"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import Link from "next/link"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import type { User } from "@/types"
import { getUsers } from "@/lib/api"
import { getRandom } from "@/utils/Random"
import { Button } from "@/components/ui/button"
import { Linker } from "@/utils/Linker"

const schools = ['Navodaya', 'GS', 'Gyanodaya', 'SIA']
const depts = ['Math', 'Science', 'English']

function deleteUser(users: User[], id: number) {
    const newUsers = users.filter((user) => user.id != id)
    // toast.info(`User (#${id}) has been deleted`)
    alert(`User (#${id}) has been deleted`)
    return newUsers
}

export default function Dashboard() {

    const [users, setUsers] = useState<User[]>([])
    useEffect(() => {
        getUsers().then(setUsers)
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
                        {/* <TableHead>School</TableHead> */}
                        {/* <TableHead>Department</TableHead> */}
                        <TableHead>Class</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Tenure</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(({ id, name, school, department, grade, program, tenure, address }: User) => (
                        <TableRow key={id}>
                            <TableCell>{name}</TableCell>
                            {/* <TableCell>{schools[getRandom(0, 3)]}</TableCell> */}
                            {/* <TableCell>{depts[getRandom(0, 2)]}</TableCell> */}
                            <TableCell>{getRandom(1, 10)}</TableCell>
                            <TableCell>{name}</TableCell>
                            <TableCell>{id == 1 ? `${id} year` : `${id} years`}</TableCell>
                            <TableCell>{`Hetauda - ${getRandom(1, 10)}`}</TableCell>
                            <TableCell className="font-medium text-[#2D84C4]">
                                <Link className="hover:font-bold" href={`/teacher/${id}`}>View</Link> |
                                <Link className="hover:font-bold" href={`/teacher/${id}`}>Edit</Link> |
                                <Link className="hover:font-bold" href='#' onClick={() => setUsers(deleteUser(users, id))}>Delete</Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}