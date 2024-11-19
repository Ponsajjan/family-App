'use client'

import { Call, CloseIcon, Deathday, Female, Male } from '@/utils/Icons';
import React, { useEffect, useState } from 'react'
import Details from './Details';
import Container from "../../components/Container";
import Link from 'next/link';

export default function List() {
    const [members, setMembers] = useState([]);
    // Manage state for showing/hiding details
    const [showDetails, setShowDetails] = useState(false);
    const [userDetails, setUserDetails] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
          try {
            setLoading(true)
            setMembers([])
            setError(null);
            
            const response = await fetch('/api/relatives', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
    
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
    
            const usersData = await response.json();
            const sortedUsers = usersData.sort((a, b) => a.name.localeCompare(b.name));
            setMembers(sortedUsers);
          } catch (error) {
            console.error("Failed to fetch members:", error);
            setError("Failed to fetch members. Please try again later.");
          } finally {
            setLoading(false)
          }
        }
    
        fetchUsers();
    }, []);

     const groupedUsers = members.reduce((acc, user) => {
        const initial = user.name.charAt(0).toUpperCase();
        if (!acc[initial]) acc[initial] = [];
        acc[initial].push(user);
        return acc;
     }, {});

    const handleShowDetails = async (user_id) => {
        try {
            const response = await fetch(`/api/user/${user_id}`);
            if (!response.ok) throw new Error('Failed to fetch user details');

            const user = await response.json();
            setUserDetails(user);
            setShowDetails(true);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    return (
        <div>
            <div className="w-full md:flex">
                {/* Left panel: User List */}
                <Container className="md:border-r md:border-border_color">
                    <div className='w-full lg:max-w-xl mx-auto'>
                    {groupedUsers.length === 0 ? (
                        <p className='p-4'>No members found.</p>
                        ) : (Object.keys(groupedUsers).sort().map((letter) => (
                            <div key={letter}>                                
                                <div className="flex text-text_color items-center px-3 bg-main_background sticky top-12 md:top-0 z-10 pb-1">
                                    <span className="font-semibold pr-1 whitespace-nowrap">{letter}</span>
                                    <span className="border-t border-border_color block w-full"></span>
                                </div>
                                {/* Render list of members */}
                                {groupedUsers[letter].map((user) => (
                                <div key={user.id} className="pl-4">
                                    <div className="border-l border-border_color pt-1 pb-2 pl-4 pr-3">
                                        <div onClick={() => handleShowDetails(user.id)} className="cursor-pointer px-3 py-2 flex justify-between items-center border border-l-4 border-border_color bg-field_color rounded text-text_color">
                                            <div>
                                                <div className="flex flex-wrap gap-2">
                                                    {user.gender === "Male" && <Male />}
                                                    {user.gender === "Female" && <Female />}
                                                    <div className='font-semibold capitalize'>{user.name}</div>
                                                    {/* <div className="font-extralight opacity-65">(athan)</div> */}
                                                </div>
                                                <div className="flex text-xs md:text-sm opacity-65">
                                                {(user.father.length > 0 || user.mother.length > 0 || user.partner.length > 0) ? (
                                                    <>
                                                    <div className="font-semibold pr-1">
                                                        {user?.father ? 'Parents:' : 'Partner:'}
                                                    </div>
                                                    {user?.descendant ? (
                                                        <>
                                                        <div>{user?.father}</div>
                                                        <div>{user?.mother}</div>
                                                        </>
                                                    ) : (
                                                        <div>{user.partner || "No Partner Assigned"}</div>
                                                    )}
                                                    </>
                                                ) : (
                                                    <div>No relationship assigned yet</div>
                                                )}
                                                </div>
                                            </div>
                                            {user.phoneNumber && <Link href={`tel:${user.phoneNumber}`}><Call /></Link>}
                                        </div>
                                    </div>
                                </div>))}
                            </div>
                        ))
                    )}
                    </div>
                </Container>

                {/* Right panel: Details view */}
                {showDetails && (
                <div onClick={() => setShowDetails(false)} className="fixed md:hidden inset-0 bg-gray-500 bg-opacity-75 transition-opacity cursor-not-allowed z-[100]" />
                )}
                <div className={`${ showDetails
                    ? "block md:static fixed left-0 right-0 bottom-0 min-h-[60%] max-h-[80%] md:max-h-full md:h-full z-[100] rounded-t-md"
                    : "hidden md:block" } w-full lg:max-w-lg mx-auto bg-main_background px-5 overflow-y-auto`} >
                    <Details data={userDetails}/>
                </div>
            </div>
        </div>
    )
}
