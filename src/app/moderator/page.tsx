'use client'

import { useEffect, useState } from 'react'
import Topnav from "@/components/Topnav"
import { ButtonOutline, LinkButtonOutline } from "../../components/Button"
import { useToast } from '@/components/Toast'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
    const toast = useToast()
    const [unverifiedCount, setUnverifiedCount] = useState<number | null>(null)
    const [pendingRequests, setPendingRequests] = useState<number | null>(null)
    const [updatingChart, setUpdatingChart] = useState(false)
    const [chartStatus, setChartStatus] = useState<string | null>(null)
    const { logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const eventSource = new EventSource('/api/moderator');

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setUnverifiedCount(data.unverifiedMembers);
                setPendingRequests(data.pendingRequests);
                setChartStatus(data.chartStatus);

                if (data.chartStatus === 'building') {
                    toast?.show('Chart build is currently in progress...', 'info', 5000);
                } else if (data.chartStatus === 'failed') {
                    toast?.show('Previous chart build failed. You can retry.', 'warning', 5000);
                } else if (data.chartStatus === 'timeout') {
                    toast?.show('Previous build timed out. You can retry.', 'warning', 5000);
                }
            } catch (error) {
                console.error("Error parsing SSE data:", error);
            }
        };

        eventSource.onerror = (error) => {
            console.error("SSE connection error:", error);
            // Optionally check for 401 status here if possible, 
            // but EventSource doesn't easily provide HTTP status codes.
            // If it fails, it will attempt to reconnect automatically.
        };

        return () => {
            eventSource.close();
        };
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
            <Topnav />
            <div className="w-full flex flex-col px-4 py-10 max-w-3xl mx-auto gap-4">
                <LinkButtonOutline
                    linkto={`moderator/verify_members`}
                    className="w-full"
                    buttonText={`Verify Members (${unverifiedCount ?? '..'})`}
                />
                <LinkButtonOutline
                    linkto={`moderator/verify_changes`}
                    className="w-full"
                    buttonText={`Verify Changes (${pendingRequests ?? '..'})`}
                />
                <ButtonOutline
                    className="w-full"
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
        </>
    )
}
