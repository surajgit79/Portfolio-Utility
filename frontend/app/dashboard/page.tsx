'use client'

import { H1 } from "@/components/defaults/Typography"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { Teachers } from "@/types"
import { getTeachers, searchTeachers, deleteTeacher, updateTeacher } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useSession } from "@/lib/useSession"
import { LogoutButton } from "@/components/defaults/LogoutButton"

export default function Dashboard() {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const { session, loading } = useSession()
    const isAdmin = session.isAuthenticated && session.role === "admin"
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [teachers, setTeachers] = useState<Teachers[]>([])
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const [loadingTeachers, setLoadingTeachers] = useState(false)

    // Visible count for pages.
    const getVisiblePages = () => {
        const range = 3
        const start = Math.max(1, page - range)
        const end = Math.min(pages, page + range)

        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    // Teacher delete helper
    async function handleDelete(id: string, e: React.MouseEvent) {
        e.stopPropagation()

        const confirmed = window.confirm('Are you sure you want to delete this teacher?')
        if (!confirmed) return

        try {
            await deleteTeacher(id)
            setTeachers((prev) => prev.filter((teacher) => teacher.id !== id))
        } catch (err) {
            console.error(err)
            alert(err instanceof Error ? err.message : 'Delete failed')
        }
    }

    //Load Teachers
    useEffect(() => {
        async function loadTeachers() {
            try {
                setLoadingTeachers(true)
                const res = await getTeachers(page)
                setTeachers(res.teachers)
                setPages(res.pagination.pages)
            } catch (error) {
                console.error('Failed to fetch teachers:', error)
            } finally {
                setLoadingTeachers(false)
            }
        }

        if (search.trim() === '') {
            loadTeachers()
        }
    }, [page, search])

    //Search Teachers
    useEffect(() => {
        const trimmed = search.trim()
        const wait = trimmed.length >= 3 ? 200 : 4000

        const delay = setTimeout(async () => {
            try {
                if (trimmed === '') {
                    const res = await getTeachers(page)
                    setTeachers(res.teachers)
                    setPages(res.pagination.pages)
                } else {
                    const res = await searchTeachers(trimmed)
                    setTeachers(res)
                    setPages(1)
                }
            } catch (error) {
                console.error('Search failed:', error)
            }
        }, wait)

        return () => clearTimeout(delay)
    }, [search, page])

    return (
        <div className="bg-white p-5 mt-10 rounded-lg">
            <div className="flex items-center my-5 justify-between">
                <H1 text="Teacher Record Management" classNames="!m-0" />
                <div className="flex gap-1 flex-col lg:flex-row">
                    {!loading && !session.isAuthenticated && (<Button className='bg-[#2D84C4] text-white cursor-pointer' onClick={(e) => {
                        router.replace('/login')
                        router.refresh()
                    }}>Login</Button>)}
                    {!loading && isAdmin && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="bg-[#2D84C4] text-white cursor-pointer"
                                >
                                    Add +
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Teacher</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => router.push("/teachers/add")}
                                    >
                                        Individual
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => router.push("/teachers/add/bulk")}
                                    >
                                        Bulk
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </DropdownMenuGroup>

                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Trainings</DropdownMenuLabel>
                                    <DropdownMenuItem 
                                        className="cursor-pointer"
                                        onClick={() => router.push("/trainings/add/bulk")}
                                    >
                                        Bulk
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {!loading && session.isAuthenticated && <LogoutButton />}
                </div>
            </div>

            <div className="bg-white py-2">
                <Field className="mb-5">
                    <Input
                        id="search"
                        type="search"
                        placeholder="Search teachers by name and school"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                    />
                </Field>
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
                    {teachers.length > 0 ? (
                        teachers.map(({ id, name, address, tenure, program, currentGrades }: Teachers, index) => (
                            <TableRow
                                key={index}
                                onClick={() => router.push(`/teachers/${id}`)}
                                className={`cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-blue-50 transition-colors`}
                            >
                                <TableCell>{name}</TableCell>
                                <TableCell>
                                    {currentGrades.map((v, i)=>{
                                        if(i === currentGrades.length - 1)
                                            return v
                                        return `${v}, `
                                    })}
                                </TableCell>
                                <TableCell>{program}</TableCell>
                                <TableCell>
                                    {tenure < 1 ? "<1 year" : tenure === 1 ? "1 year" : `${tenure} years`}
                                </TableCell>
                                <TableCell>{address}</TableCell>

                                <TableCell className="font-medium text-[#2D84C4]">
                                    <Link
                                        className="hover:font-bold"
                                        href={`/teachers/${id}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View
                                    </Link>

                                    {!loading && isAdmin && (
                                        <>
                                            {" | "}
                                            <Link
                                                className="hover:font-bold"
                                                href={`/teachers/${id}/edit`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Edit
                                            </Link>

                                            {" | "}
                                            <button
                                                type="button"
                                                className="hover:font-bold cursor-pointer"
                                                onClick={(e) => handleDelete(id, e)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                                No teachers found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="mt-6 flex items-center justify-center gap-2">
                <button onClick={() => setPage(1)} className="cursor-pointer">First</button>
                {getVisiblePages().map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={`rounded border px-3 py-1 ${page === p ? 'bg-blue-600 text-white' : 'bg-white'
                            }`}
                    >
                        {p}
                    </button>
                ))}
                <button onClick={() => setPage(pages)} className="cursor-pointer">Last</button>
            </div>
        </div>
    )
}