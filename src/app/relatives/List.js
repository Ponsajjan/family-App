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
            setMembers(usersData);
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

            setUserDetails(user.data);
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
                                                            {user.gender === "Male" ? <Male /> : <Female />}
                                                            <div className='font-semibold capitalize'>{user.name}</div>
                                                            {/* <div className="font-extralight opacity-65">(athan)</div> */}
                                                        </div>
                                                        <div className="flex text-xs md:text-sm opacity-65 flex-wrap gap-1">
                                                        {/* Parents */}
                                                        {(user.father || user.mother) ? (
                                                            <>
                                                            <span className="pr-1 font-semibold">
                                                                Parents:
                                                            </span>
                                                            {user.father && (
                                                                <span className="pr-1">
                                                                    {user.father.name},
                                                                </span>
                                                            )}
                                                            {user.mother && (
                                                                <span className="pr-1">
                                                                    {user.mother.name}
                                                                </span>
                                                            )}
                                                            </>
                                                        ) : user.partner ? (
                                                            <div>
                                                                <span className="pr-1 font-semibold">
                                                                    Partner:
                                                                </span>
                                                                <span className='pr-1'>
                                                                    {user.partner.name}
                                                                </span>
                                                            </div>
                                                        ) : 'No relationship assigned yet'}
                                                        </div>
                                                    </div>
                                                    {user.phoneNumber && 
                                                    <Link onClick={(e) => e.stopPropagation()} className='cursor-pointer' href={`tel:${user.phoneNumber}`}>
                                                        <Call />
                                                    </Link>}
                                                </div>
                                            </div>
                                        </div>))}
                                    </div>
                                )))}
                            </div>
                        </div> 
                    }
                </Container>
                <div
                    onClick={() => setShowDetails(false)}
                    className={`fixed md:hidden ${showDetails ? 'top-0 bg-gray-500/60' : 'bottom-full delay-300 bg-gray-300/5'} inset-0 z-[100] duration-500 ease-in-out`}
                />
                <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background ${showDetails ? 'md:border-l md:border-border_color z-[100] rounded-t-md md:rounded-none -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full lg:max-w-lg mx-auto overflow-y-auto`}>
                    <div className={`overflow-x-hidden ${showDetails ? 'visible md:delay-300 transition-all ease-in-out' : 'invisible'}`}>{loadingDetails ? <Loading /> : <Details data={userDetails} openDetails={setShowDetails} />}</div>
                </div>
            </div>
        </div>
    )
}
