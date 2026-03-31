'use client'

import { useState, useEffect } from 'react'
import useSWR, { useSWRConfig } from 'swr';
import Topnav from "@/components/Topnav"
import { ButtonOutline, LinkButtonOutline } from "../../components/Button"
import { useToast } from '@/components/Toast'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { NextArrow, SwitchIcon } from '@/utils/Icons'
import { ChoosePopup } from '@/components/ChoosePopup'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { setIsModerator, setCurrentAuthId, setAccounts } from '@/store/slices/termsSlice';
import Link from 'next/link';
import { useVersionCheck } from "@/hooks/useVersionCheck";

export default function ModeratorDashboard() {
    const toast = useToast();
    const { checkVersion } = useVersionCheck();
    const [updatingChart, setUpdatingChart] = useState(false);
    const [disabledButtons, setDisabledButtons] = useState(false);
    const [showChoosePopup, setShowChoosePopup] = useState(false);
    const { logout, storeLoginValues } = useAuth();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { mainMemberName, choosePopupAccounts, isModerator, accounts } = useSelector((state: RootState) => state.terms);

    const { data, isLoading, mutate } = useSWR('/api/moderator');

    useEffect(() => {
        if (!isLoading) {
            checkVersion();
        }
    }, []);
    const { mutate: globalMutate } = useSWRConfig();
    // Effect for Toasts based on chartStatus
    useEffect(() => {
        if (data) {
            if (data.chartStatus === 'building') {
                toast?.show('Chart build is currently in progress...', 'info', 5000);
            } else if (data.chartStatus === 'failed') {
                toast?.show('Previous chart build failed. You can retry.', 'warning', 5000);
            } else if (data.chartStatus === 'timeout') {
                toast?.show('Previous build timed out. You can retry.', 'warning', 5000);
            }
        }
    }, [data, toast]);

    const handleUpdateRelationsChart = async () => {
        try {
            const res = await fetch('/api/moderator/update_chart', {
                method: 'POST',
            })

            if (res.status === 401) {
                logout()
                return
            }

            if (res.status === 403) {
                setDisabledButtons(true);
                router.push('/moderator/login');
                toast?.show("Unauthorized access. Please login.", "error", 5000);
                return;
            }
            setUpdatingChart(true)
            const data = await res.json()

            if (res.ok) {
                toast?.show(data.message, 'success', 5000)
                globalMutate('/api/tree', undefined, { revalidate: false });
                mutate(); // Refresh the counts and status

                // Display conflict warnings if any circular relationships were detected
                if (data.conflicts && data.conflicts.length > 0) {
                    console.warn('Circular relationship conflicts detected:', data.conflicts)

                    data.conflicts.forEach((conflict: any, index: number) => {
                        // Show warning toast for each conflict with a delay
                        setTimeout(() => {
                            toast?.show(
                                `⚠️ Circular relationship: "${conflict.parentMemberName}" (ID: ${conflict.parentMemberId}) → "${conflict.childMemberName}" (ID: ${conflict.childMemberId})`,
                                'warning',
                                8000
                            )
                        }, (index + 1) * 500) // Stagger warnings by 500ms
                    })
                }
            } else if (res.status === 409) {
                // Build already in progress
                toast?.show(data.error || "Build already in progress", 'warning', 5000)
                mutate(); // Refresh status to reflect building
            } else {
                toast?.show(data.error || "Failed to update chart", 'error', 5000)
            }
        } catch (error: any) {
            toast?.show(
                "An error occurred while updating the chart",
                'error',
                5000
            )
        } finally {
            setUpdatingChart(false)
        }
    }

    const handleModeratorLogout = async () => {
        if (isLoading) return;

        try {
            const response = await fetch('/api/auth/moderator_logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to logout from moderator');
            }

            const data = await response.json();
            if (data.newtoken) {
                await storeLoginValues(data.newtoken, data.userType, data.authId, data.oldAuthId);
                dispatch(setIsModerator(false));
                dispatch(setCurrentAuthId(data.authId));
                // Swap old moderator authId → new member authId in the accounts list
                dispatch(setAccounts(
                    accounts.map(acc =>
                        String(acc.authId) === String(data.oldAuthId)
                            ? { ...acc, authId: data.authId }
                            : acc
                    )
                ));
                toast?.show(data.message || 'Logout successfully', 'success', 5000);
            } else {
                toast?.show(data.error || 'Logout failed', 'error', 5000);
            }
        } catch (error: any) {
            toast?.show(error.message || 'Failed to logout from moderator', 'error', 5000);
        }
    };

    return (
        <>
            <Topnav>
                <div className="ml-auto mr-0 w-fit block">
                    {isModerator ? (
                        <button onClick={handleModeratorLogout} className={`${isLoading ? 'opacity-55 cursor-wait' : 'cursor-pointer'} group flex items-center text-xs md:text-sm text-text_color`}>
                            Logout from Moderator
                            <span className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-1.5">
                                <NextArrow />
                            </span>
                        </button>
                    ) : (
                        <Link href="/moderator/login" className='group flex items-center text-xs md:text-sm text-text_color'>
                            Login as Moderator
                            <span className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-1.5">
                                <NextArrow />
                            </span>
                        </Link>
                    )}
                </div>
            </Topnav>
            {!isLoading ? <div className="w-full flex flex-col px-4 py-10 max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-2 h-9">
                    {choosePopupAccounts.length > 1 && <>
                        <span className="text-text_color/60 w-10 border-b border-border_color border-dashed" />
                        <span className="text-text_color/60 md:text-sm text-xs whitespace-nowrap max-w-56 text-ellipsis overflow-clip">{mainMemberName} Family</span>
                        <span className="text-text_color/60 w-full border-b border-border_color border-dashed" />
                        <div
                            onClick={() => setShowChoosePopup(true)}
                            className="ml-auto mr-0 border border-border_color flex items-center justify-between rounded-full px-1 py-1 cursor-pointer hover:bg-field_hover transition-colors"
                        >
                            <SwitchIcon />
                        </div>
                    </>}
                </div>
                <LinkButtonOutline
                    linkto={`moderator/verify_members`}
                    className="w-full mb-4"
                    buttonText={`Verify Members (${data?.unverifiedMembers ?? '..'})`}
                    disabled={disabledButtons}
                />
                <LinkButtonOutline
                    linkto={`moderator/verify_changes`}
                    className="w-full mb-4"
                    buttonText={`Verify Changes (${data?.pendingRequests ?? '..'})`}
                    disabled={disabledButtons}
                />
                <ButtonOutline
                    className="w-full mb-4"
                    buttonText={
                        data?.chartStatus === 'building'
                            ? "Building in progress..."
                            : updatingChart
                                ? "Updating..."
                                : "Update Relations Chart"
                    }
                    onClick={handleUpdateRelationsChart}
                    disabled={updatingChart || data?.chartStatus === 'building' || disabledButtons}
                />
            </div> :
                <div className="w-full flex flex-col px-4 py-10 max-w-3xl mx-auto">
                    <div className="mb-2 h-9">
                    </div>
                    <LinkButtonOutline
                        linkto={`moderator/verify_members`}
                        className="w-full mb-4 opacity-50"
                        buttonText=""
                    />
                    <LinkButtonOutline
                        linkto={`moderator/verify_changes`}
                        className="w-full mb-4 opacity-50"
                        buttonText=""
                    />
                    <ButtonOutline
                        className="w-full mb-4 opacity-50"
                        buttonText=""
                    />
                </div>}

            {showChoosePopup && (
                <ChoosePopup
                    showPopup={showChoosePopup}
                    setShowPopup={setShowChoosePopup}
                    onSwitchSuccess={() => mutate()}
                />
            )}
        </>
    )
}
