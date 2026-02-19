'use client'

import { useEffect, useState } from 'react'
import Topnav from "@/components/Topnav"
import { ButtonOutline, LinkButtonOutline } from "../../components/Button"
import { useToast } from '@/components/Toast'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { SwitchIcon } from '@/utils/Icons'
import { ChoosePopup } from '@/components/ChoosePopup'

export default function AdminDashboard() {
    const toast = useToast()
    const [unverifiedCount, setUnverifiedCount] = useState<number | null>(null)
    const [pendingRequests, setPendingRequests] = useState<number | null>(null)
    const [updatingChart, setUpdatingChart] = useState(false)
    const [chartStatus, setChartStatus] = useState<string | null>(null)
    const [showChoosePopup, setShowChoosePopup] = useState(false)
    const { logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/moderator', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (res.status === 401) {
                    logout()
                    return
                }

                if (!res.ok) {
                    throw new Error("Failed to fetch moderator data")
                }

                const data = await res.json()
                setUnverifiedCount(data.unverifiedMembers)
                setPendingRequests(data.pendingRequests)
                setChartStatus(data.chartStatus)

                if (data.chartStatus === 'building') {
                    toast?.show('Chart build is currently in progress...', 'info', 5000)
                } else if (data.chartStatus === 'failed') {
                    toast?.show('Previous chart build failed. You can retry.', 'warning', 5000)
                } else if (data.chartStatus === 'timeout') {
                    toast?.show('Previous build timed out. You can retry.', 'warning', 5000)
                }
            } catch (error: any) {
                toast?.show(error.message || "Failed to fetch data", 'error', 5000)
                console.error("Failed to fetch data:", error)
            }
        }

        fetchData()
    }, [toast, logout])

    const handleUpdateRelationsChart = async () => {
        try {
            setUpdatingChart(true)
            const res = await fetch('/api/moderator/update_chart', {
                method: 'POST',
            })

            if (res.status === 401) {
                logout()
                return
            }

            if (res.status === 403) {
                router.push('/terms/moderator_login');
                toast?.show("Unauthorized access. Please login.", "error", 5000);
                return;
            }

            const data = await res.json()

            if (res.ok) {
                toast?.show(data.message, 'success', 5000)
                setChartStatus('completed') // Update local status

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
                setChartStatus('building')
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

    return (
        <>
            <Topnav>

            </Topnav>
            <div className="w-full flex flex-col px-4 py-10 max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-text_color/60 text-sm w-10 border-b border-border_color border-dashed" />
                    <span className="text-text_color/60 text-sm whitespace-nowrap">Moderator Panel</span>
                    <span className="text-text_color/60 text-sm w-full border-b border-border_color border-dashed" />
                    <div
                        onClick={() => setShowChoosePopup(true)}
                        className="ml-auto mr-0 border border-border_color flex items-center justify-between rounded-full px-1 py-1 cursor-pointer hover:bg-field_hover transition-colors"
                    >
                        <SwitchIcon />
                    </div>
                </div>
                <LinkButtonOutline
                    linkto={`moderator/verify_members`}
                    className="w-full mb-4"
                    buttonText={`Verify Members (${unverifiedCount ?? '..'})`}
                />
                <LinkButtonOutline
                    linkto={`moderator/verify_changes`}
                    className="w-full mb-4"
                    buttonText={`Verify Changes (${pendingRequests ?? '..'})`}
                />
                <ButtonOutline
                    className="w-full mb-4"
                    buttonText={
                        chartStatus === 'building'
                            ? "Building in progress..."
                            : updatingChart
                                ? "Updating..."
                                : "Update Relations Chart"
                    }
                    onClick={handleUpdateRelationsChart}
                    disabled={updatingChart || chartStatus === 'building'}
                />
            </div>

            {showChoosePopup && (
                <ChoosePopup showPopup={showChoosePopup} setShowPopup={setShowChoosePopup} />
            )}
        </>
    )
}
