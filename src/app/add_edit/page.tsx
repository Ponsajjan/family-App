'use client'

import { useSearchParams, useRouter } from "next/navigation"
import { LinkButtonOutline } from "../../components/Button"
import { SwitchIcon } from "@/utils/Icons"
import { useEffect, useState } from "react"
import { ChoosePopup } from "@/components/ChoosePopup"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

export default function AddEditPage() {
    const [showChoosePopup, setShowChoosePopup] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const { mainMemberName, choosePopupAccounts } = useSelector((state: RootState) => state.terms);
    const mode = searchParams.get('mode');

    useEffect(() => {
        if (choosePopupAccounts.length > 1 && !mode) {
            setShowChoosePopup(true);
        }
    }, [choosePopupAccounts.length, mode, setShowChoosePopup]);

    // Get the 'mode' parameter from URL, default to 'add'
    const currentMode = mode || 'add'
    const isAddMode = currentMode === 'add'

    const handleModeChange = (mode: 'add' | 'edit') => {
        // Update URL with the new mode parameter
        const params = new URLSearchParams(searchParams.toString())
        params.set('mode', mode)
        router.push(`?${params.toString()}`)
    }


    return (
        <div className="w-full flex flex-col px-4 py-10 max-w-3xl mx-auto">
            {showChoosePopup && (
                <ChoosePopup
                    setShowPopup={setShowChoosePopup}
                />
            )}
            <div className="relative flex mx-auto border-2 border-text_color rounded-2xl overflow-hidden w-fit select-none mb-2">
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

            <div className="relative flex items-center gap-2 h-10">
                {choosePopupAccounts.length > 1 &&
                    <>
                        <div className="text-text_color/60 z-10 bg-main_background md:text-sm text-xs whitespace-nowrap px-1.5 mx-4 max-w-80 text-ellipsis overflow-clip">{mainMemberName} Family</div>
                        <div className="ml-auto mr-0 z-10 bg-main_background px-1.5">
                            <button
                                type="button"
                                onClick={() => setShowChoosePopup(true)}
                                className="border border-border_color flex items-center justify-between rounded-full p-1 cursor-pointer hover:bg-field_hover transition-colors bg-transparent text-inherit focus:outline-none"
                            >
                                <SwitchIcon />
                            </button>
                        </div>
                        <span className="absolute text-text_color/60 w-full border-b border-border_color border-dashed" />
                    </>}
            </div>
            <div className="pt-2">
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
        </div>
    )
}