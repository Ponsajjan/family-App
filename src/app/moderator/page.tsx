'use client'

import { useEffect, useState } from 'react'
import Topnav from "@/components/Topnav"
import { LinkButtonOutline } from "../../components/Button"

export default function AdminDashboard() {
    const [unverifiedCount, setUnverifiedCount] = useState<number | null>(null)
    const [pendingRequests, setPendingRequests] = useState<number | null>(null)

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/moderator')
                const data = await res.json()
                setUnverifiedCount(data.unverifiedMembers)
                setPendingRequests(data.pendingRequests)
            } catch (error) {
                console.error("Failed to fetch stats:", error)
            }
        }

        fetchStats()
    }, [])

    return (
        <>
            <Topnav />
            <div className="w-full flex flex-col px-4 py-10 max-w-3xl mx-auto">
                <LinkButtonOutline 
                    linkto={`moderator/verify_members`} 
                    className="w-full mb-4" 
                    buttonText={`Verify Members (${unverifiedCount ?? '..'})`} 
                />
                <LinkButtonOutline 
                    linkto={`moderator/verify_changes`}  
                    className="w-full" 
                    buttonText={`Verify Changes (${pendingRequests ?? '..'})`} 
                />
            </div>
        </>
    )
}
