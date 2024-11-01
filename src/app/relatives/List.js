'use client'

import { Call, CloseIcon, Deathday, Female, Male } from '@/utils/Icons';
import React, { useState } from 'react'
import Details from './Details';
import Container from "../../components/Container";

export default function List({usersByAlphabet}) {
    // Sort the keys alphabetically for display
    const alphabetKeys = Object.keys(usersByAlphabet).sort();

    // Manage state for showing/hiding details
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div>
            <div className="w-full md:flex">
                {/* Left panel: User List */}
                <Container className="md:border-r md:border-border_color">
                    <div className='w-full lg:max-w-xl mx-auto'>
                    {alphabetKeys.length === 0 ? (
                        <p>No users found.</p>
                        ) : (
                        alphabetKeys.map((letter) => (
                            <div key={letter}>                                
                                <div className="flex text-text_color items-center px-3 bg-main_background sticky top-12 md:top-3 z-10">
                                    <span className="font-semibold pr-1 whitespace-nowrap">{letter}</span>
                                    <span className="border-t border-border_color block w-full"></span>
                                </div>
                                {/* Render list of users */}
                                {usersByAlphabet[letter].map((user) => (
                                <div key={user.id} className="pl-4">
                                    <div className="border-l border-border_color py-1 pl-4 pr-3">
                                        <div onClick={() => setShowDetails(true)} className="cursor-pointer px-3 py-2 flex justify-between items-center border border-l-4 border-border_color bg-field_color rounded text-text_color">
                                            <div>
                                                <div className="flex flex-wrap gap-2">
                                                    {user.name === "hay" ? <Male /> : <Female /> }
                                                    <div className='font-semibold capitalize'>{user.name}</div>
                                                    <div className="font-extralight opacity-65">(athan)</div>
                                                </div>
                                                <div className='flex text-xs md:text-sm leading-3 opacity-65'>
                                                    <div className='font-semibold pr-1'>Parents:</div>
                                                    <div>Hello, World</div>
                                                </div>
                                            </div>
                                            <Call />
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
                    ? "block md:static fixed left-0 right-0 bottom-0 min-h-[60%] max-h-[90%] md:h-full z-[100] rounded-t-md"
                    : "hidden md:block" } w-full lg:max-w-lg mx-auto bg-main_background px-5 overflow-y-auto pb-4`} >
                    <Details />
                </div>
            </div>
        </div>
    )
}
