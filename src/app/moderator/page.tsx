'use client'

import { useEffect, useState } from 'react'
import Topnav from "@/components/Topnav"
import { ButtonOutline, LinkButtonOutline } from "../../components/Button"
import { useToast } from '@/components/Toast'

export default function AdminDashboard() {
    const toast = useToast()
    const [unverifiedCount, setUnverifiedCount] = useState<number | null>(null)
    const [pendingRequests, setPendingRequests] = useState<number | null>(null)

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/moderator',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }
                )
                const data = await res.json()
                setUnverifiedCount(data.unverifiedMembers)
                setPendingRequests(data.pendingRequests)
            } catch (error: any) {
                toast?.show(error.message || "Failed to fetch stats", 'error', 5000)
                console.error("Failed to fetch stats:", error)
            }
        }

        fetchStats()
    }, [toast])

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
                    buttonText="Update Relations Chart"
                />
            </div>
        </>
    )
}
