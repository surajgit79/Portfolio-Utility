"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getTeacherById, updateTeacher } from "@/lib/api"

type TeacherForm = {
    name: string
    email: string
    contact: string
    address: string
    gender: string
    imageUrl: string
    dob: string
    qualification: string
    teachingSince: number
}

export default function EditTeacherPage() {
    const { id } = useParams()
    const router = useRouter()
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [preview, setPreview] = useState("")

    const [original, setOriginal] = useState<TeacherForm | null>(null)

    const [form, setForm] = useState<TeacherForm>({
        name: "",
        email: "",
        contact: "",
        address: "",
        gender: "",
        imageUrl: "",
        dob: "",
        qualification: "",
        teachingSince: new Date().getFullYear(),
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!id) return

        getTeacherById(id as string)
            .then((res) => {
                const teacher = res.data

                const normalized = {
                    name: teacher.name || "",
                    email: teacher.email || "",
                    contact: teacher.contact || "",
                    address: teacher.address || "",
                    gender: teacher.gender || "",
                    imageUrl: teacher.imageUrl || "",
                    dob: teacher.dob?.split("T")[0] || "",
                    qualification: teacher.qualification || "",
                    teachingSince: teacher.teachingSince?.toString() || "",
                }

                setForm(normalized)
                setOriginal(normalized)
                setPreview(teacher.imageUrl || "")
            })
            .finally(() => setLoading(false))
    }, [id])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const formData = new FormData()

        if (!original) return

        if (form.name !== original.name) formData.append("name", form.name)
        if (form.email !== original.email) formData.append("email", form.email)
        if (form.contact !== original.contact) formData.append("contact", form.contact)
        if (form.address !== original.address) formData.append("address", form.address)
        if (form.gender !== original.gender) formData.append("gender", form.gender)
        if (form.dob !== original.dob) formData.append("dob", form.dob)
        if (form.qualification !== original.qualification) formData.append("qualification", form.qualification)

        if (Number(form.teachingSince) !== Number(original.teachingSince)) {
            formData.append("teachingSince", String(Number(form.teachingSince)))
        }

        if (imageFile) {
            formData.append("image", imageFile)
        }

        if ([...formData.entries()].length === 0) {
            alert("No changes made")
            setSaving(false)
            return
        }

        try {
            await updateTeacher(id as string, formData)
            router.push(`/teachers/${id}`)
        } catch (err) {
            console.error("Update teacher error:", err)
            alert(err instanceof Error ? err.message : "Failed to update teacher")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <p className="p-6">Loading teacher...</p>
    }

    return (
        <div className="max-w-xl mx-auto p-10 bg-white mt-10 rounded-md">
            <h1 className="text-2xl font-bold mb-6">Edit Teacher</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block mb-1 font-medium">Profile Image</label>

                    <div className="flex items-center gap-4">
                        <img
                            src={
                                preview ||
                                "/profilePlaceholder.jpg"
                            }
                            alt="Teacher preview"
                            className="h-24 w-24 max-h-24 max-w-24 min-h-24 min-w-24 rounded-full object-cover"
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null
                                setImageFile(file)

                                if (file) {
                                    setPreview(URL.createObjectURL(file))
                                }
                            }}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Contact</label>
                    <input
                        name="contact"
                        value={form.contact}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Address</label>
                    <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Gender</label>
                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded bg-white"
                    >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                    </select>
                </div>



                <div>
                    <label className="block mb-1 font-medium">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Qualification</label>
                    <input
                        name="qualification"
                        value={form.qualification}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Teaching Since</label>
                    <input
                        name="teachingSince"
                        type="number"
                        value={form.teachingSince}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div className="flex gap-3 mt-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="px-5 h-9 bg-[#2D84C4]"
                    >
                        {saving ? "Saving..." : "Save"}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="px-5 h-9"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}