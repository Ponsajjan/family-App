'use client'

import { useState } from "react"
import { LinkButtonOutline, LinkButtonSolid } from "@/components/Button"

export default function AdminDashboard() {
    const [add, setAdd] = useState(true)

    return (
        <div className="w-full flex flex-col px-4 py-10 max-w-3xl mx-auto">
            <div className="relative flex mx-auto mb-8 md:mb-10 border-2 border-text_color rounded-2xl overflow-hidden w-fit">
                <p onClick={() => setAdd(true)} className={`px-8 md:px-10 z-10 py-1 md:py-2 cursor-pointer ${add ? 'text-accent_contrast' : 'text-text_color'}  transition-all duration-500 font-semibold ease-in-out`}>Add</p>
                <p onClick={() => setAdd(false)} className={`px-8 md:px-10 z-10 py-1 md:py-2 cursor-pointer ${add ? 'text-text_color' : 'text-accent_contrast'}  transition-all duration-500 font-semibold ease-in-out`}>Edit</p>
                <span className={`absolute top-0 bottom-0 rounded-xl w-1/2 ${add ? 'left-0' : 'transform translate-x-full'} bg-accent_color transition-all duration-500 ease-in-out`}></span>
            </div>
            
            <LinkButtonOutline linkto={`add_edit/${add ? 'add' : 'edit'}_member`} className="w-full mb-4" buttonText={`${add ? 'Add' : 'Edit'} Member`} />

            <LinkButtonOutline linkto={`add_edit/${add ? 'add' : 'edit'}_relationship`}  className="w-full" buttonText={`${add ? 'Add' : 'Edit'} Relationship`} />
        </div>
    )
}