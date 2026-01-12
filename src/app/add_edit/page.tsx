'use client'

import { useSearchParams, useRouter } from "next/navigation"
import { LinkButtonOutline } from "../../components/Button"

export default function AdminDashboard() {
    const searchParams = useSearchParams()
    const router = useRouter()

    // Get the 'mode' parameter from URL, default to 'add'
    const currentMode = searchParams.get('mode') || 'add'
    const isAddMode = currentMode === 'add'

    const handleModeChange = (mode: 'add' | 'edit') => {
        // Update URL with the new mode parameter
        const params = new URLSearchParams(searchParams.toString())
        params.set('mode', mode)
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="w-full flex flex-col px-4 py-10 max-w-3xl mx-auto">
            <div className="relative flex mx-auto mb-8 md:mb-10 border-2 border-text_color rounded-2xl overflow-hidden w-fit select-none">
                <p
                    onClick={() => handleModeChange('add')}
                    className={`px-8 md:px-10 z-10 py-1 md:py-2 cursor-pointer ${isAddMode ? 'text-accent_contrast' : 'text-text_color'}  transition-all duration-500 font-semibold ease-in-out`}
                >
                    Add
                </p>
                <p
                    onClick={() => handleModeChange('edit')}
                    className={`px-8 md:px-10 z-10 py-1 md:py-2 cursor-pointer ${isAddMode ? 'text-text_color' : 'text-accent_contrast'}  transition-all duration-500 font-semibold ease-in-out`}
                >
                    Edit
                </p>
                <span className={`absolute top-0 bottom-0 rounded-xl w-1/2 ${isAddMode ? 'left-0' : 'transform translate-x-full'} bg-accent_color transition-all duration-500 ease-in-out`}></span>
            </div>

            <LinkButtonOutline
                linkto={`add_edit/${isAddMode ? 'add' : 'edit'}_member`}
                className="w-full mb-4"
                buttonText={`${isAddMode ? 'Add' : 'Edit'} Member`}
            />

            <LinkButtonOutline
                linkto={`add_edit/${isAddMode ? 'add' : 'edit'}_relationship`}
                className="w-full"
                buttonText={`${isAddMode ? 'Add' : 'Edit'} Relationship`}
            />
        </div>
    )
}