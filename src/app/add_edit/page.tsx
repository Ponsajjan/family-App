'use client'

import { useSearchParams, useRouter } from "next/navigation"
import { LinkButtonOutline } from "../../components/Button"
import { SwitchIcon } from "@/utils/Icons"
import { useEffect, useState, Suspense } from "react"
import { useToast } from "@/components/Toast"
import { ChoosePopup } from "@/components/ChoosePopup"

interface SwitchAccount {
    authId: string;
    name: string;
}

interface SelectedMembersData {
    member: { name: string } | null;
    switchAccounts: SwitchAccount[];
}

export default function AddEditPage() {
    const [showChoosePopup, setShowChoosePopup] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<SelectedMembersData | null>(null);
    const [fetchTrigger, setFetchTrigger] = useState(0);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await fetch('/api/selectedMembers');
                if (!res.ok) throw new Error("Failed to fetch accounts");
                const json = await res.json();
                setData(json);
            } catch (error: any) {
                toast?.show(error.message || "Failed to load accounts", "error", 5000);
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, [toast, fetchTrigger]);

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
            <div className="relative flex mx-auto mb-6 border-2 border-text_color rounded-2xl overflow-hidden w-fit select-none">
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

            {!loading && data ? (
                <>
                    <div className="flex items-center gap-2 h-10">
                        <span className="text-text_color/60 w-10 border-b border-border_color border-dashed" />
                        <span className="text-text_color/60 md:text-sm text-xs whitespace-nowrap w-56 text-ellipsis overflow-clip">{data.member?.name} Family</span>
                        <span className="text-text_color/60 w-full border-b border-border_color border-dashed" />
                        <div
                            onClick={() => setShowChoosePopup(true)}
                            className="ml-auto mr-0 border border-border_color flex items-center justify-between rounded-full px-1 py-1 cursor-pointer hover:bg-field_hover transition-colors">
                            <SwitchIcon />
                        </div>
                    </div>
                    <div className="pt-6">
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
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2 h-10">
                    </div>
                    <div className="pt-6">
                        <LinkButtonOutline
                            className="w-full mb-4 opacity-50"
                            buttonText=""
                        />

                        <LinkButtonOutline
                            className="w-full opacity-50"
                            buttonText=""
                        />
                    </div>
                </>
            )}
            {showChoosePopup && (
                <ChoosePopup
                    showPopup={showChoosePopup}
                    setShowPopup={setShowChoosePopup}
                    data={data?.switchAccounts || undefined}
                    onSwitchSuccess={() => setFetchTrigger(prev => prev + 1)}
                />
            )}
        </div>
    )
}