"use client"

import { addUsers } from "./_actions/create_user"
import { ButtonSolid } from "./_components/Button"
import { useFormState, useFormStatus } from "react-dom"


export default function AdminDashboard() {
    const [error, action] = useFormState(addUsers, {})
    

    return (
        <form action={action} className="flex flex-col gap-2 px-4">
            <input className="border p-2" placeholder='Name' name='name' />
            {error.name && <div className="text-red-500">{error.name}</div>}
            <input className="border p-2" placeholder='Date Of Birth' name='birthday' type="date"/>
            {error.birthday && <div className="text-red-500">{error.birthday}</div>}
            <input className="border p-2" placeholder='Contact Number' name='contact_number' />
            {error.contact_number && <div className="text-red-500">{error.contact_number}</div>}
            <textarea className="border p-2" placeholder='Current Location' name='current_location' />
            {error.current_location && <div className="text-red-500">{error.current_location}</div>}
            <ButtonSolid type="submit" buttonText="submit" />
        </form>
    )
}