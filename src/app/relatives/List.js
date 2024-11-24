'use client'

import { Call, Female, Male } from '@/utils/Icons';
import React, { useEffect, useState } from 'react'
import Details from './Details';
import Container from "../../components/Container";
import Link from 'next/link';
import Loading from '@/components/Loading';

export default function List() {
    const [members, setMembers] = useState([]);
    // Manage state for showing/hiding details
    const [showDetails, setShowDetails] = useState(false);
    const [userDetails, setUserDetails] = useState(false);
    const [loadingList, setLoadingList] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
          try {
            setLoadingList(true);
            setMembers([]);
            
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
          } finally {
            setLoadingList(false)
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
            setLoadingDetails(true)
            const response = await fetch(`/api/relatives/${user_id}`);
            if (!response.ok) throw new Error('Failed to fetch user details');

            const user = await response.json();
            setUserDetails(user.data[0]);
            setShowDetails(true);
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoadingDetails(false)
        }
    };

    return (
        <div>
            <div className="w-full md:flex">
                {/* Left panel: User List */}
                <Container>
                    <div className='pt-4'></div>
                    {loadingList && <Loading/>}
                    {!loadingList && groupedUsers.length === 0 ? (
                        <p className='p-4'>No members found.</p>
                        ) : <div className='max-w-3xl'>
                            <div className='max-w-xl mx-auto'>
                                {(Object.keys(groupedUsers).sort().map((letter) => (
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
                                )))}
                            </div>
                        </div> 
                    }
                </Container>
                {showDetails && (
                <div
                    onClick={() => setShowDetails(false)}
                    className="fixed md:hidden inset-0 bg-gray-500 bg-opacity-75 z-[100]"
                /> )}
                <div className={`${showDetails ? 'md:border-l md:border-border_color md:static fixed left-0 right-0 bottom-0 z-[100] rounded-t-md' : 'md:w-0 h-0 opacity-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full lg:max-w-lg mx-auto overflow-y-auto`}>
                {loadingDetails ? <Loading /> : <Details data={userDetails} openDetails={setShowDetails} />}
                </div>
            </div>
        </div>
    )
}
