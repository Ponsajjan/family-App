'use client'

import Container from '@/components/Container';
import { HoldButton } from '@/components/HoldButton';
import Loading from '@/components/Loading';
import { useToast } from '@/components/Toast';
import { CloseIcon, Condolences, Female2, Info, Male2, Verified } from '@/utils/Icons';
import { getCookie } from 'cookies-next';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function NewMemberDetails({ showDetailsFor, setShowDetails, handleMemberSearch, setMembers, members, selectedFilter }: any) {
    const toast = useToast();
    const router = useRouter();
    const token = getCookie('token');
    const [data, setData] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        async function fetchMembers() {
            try {
                setLoadingDetails(true)
                const response = await fetch(`/api/moderator/verifyMember/${showDetailsFor.id}`,
                    {
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    }
                );
                // Handle 401 Unauthorized
                if (response.status === 401) {
                    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    router.push('/login');
                    return;
                }
                if (!response.ok) throw new Error('Failed to fetch member details');
        
                const member = await response.json();
        
                setData(member.data);
            } catch (error:any) {
                if (toast) {
                    toast.show(error.message || "Error fetching member details", "error", 5000);
                } else {
                    alert(error.message || "Error fetching member details")
                }
            } finally {
                setLoadingDetails(false)
            }
        }
    
        fetchMembers();

    }, [toast, showDetailsFor]);


    const handleVerification = async (memberId: number) => {
        try {
            const response = await fetch(`/api/moderator/verifyMember/${memberId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });
            const result = await response.json();

            // Handle 401 Unauthorized
            if (response.status === 401) {
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                router.push('/login');
                return;
            }
            // Handle API response
            if (!response.ok) {
                toast?.show(result.error || "Something went wrong", "error", 5000);
                return;
            }
    
            toast?.show(result.message, "success", 5000);
    
            const wasVerified = data?.generalInformation.verified;
            const isNowVerified = !wasVerified;

            setData((prev: any) => ({
                ...prev, generalInformation: {
                    ...prev.generalInformation, // Preserve all existing properties
                    verified: isNowVerified // Toggle the verified status
                }
            }));
   
            // Handle member update logic based on selectedFilter
            const shouldRemove =
                (selectedFilter === 'Verified' && !isNowVerified) ||
                (selectedFilter === 'Unverified' && isNowVerified);
    
            const shouldAdd =
                (selectedFilter === 'Verified' && isNowVerified) ||
                (selectedFilter === 'Unverified' && !isNowVerified);
    
            if (shouldRemove) {
                setMembers((prev: any) => prev.filter((item: any) => item.id !== memberId));
            } else if (shouldAdd) {
                setMembers((prev: any) => {
                    const exists = prev.some((item: any) => item.id === memberId);
                    return exists ? prev : [...prev, showDetailsFor];
                });
            } else if (selectedFilter === 'All') {
                const updatedData = members.map((item: any) =>
                    item.id === memberId
                        ? {
                            ...item,
                            verified: !item.verified,
                        }
                        : item
                );
                setMembers(updatedData);
            }
    
        } catch (error) {
            console.error("Error verifying member:", error);
            toast?.show("An error occurred. Please try again.", "error", 5000);
        }
    };
    

    const handleDelete = async (memberId: number) => {
        try {
            const response = await fetch(`/api/moderator/verifyMember/${memberId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });
            const result = await response.json();

            // Handle 401 Unauthorized
            if (response.status === 401) {
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                router.push('/login');
                return;
            }
            // Handle API response
            if (!response.ok) {
                if (toast) {
                toast.show(result.error || "Something went wrong", "error", 5000);
                return;
                }
                throw new Error(result.error || "Something went wrong");
                // throw allows the error to be caught and handled by any surrounding `try...catch` blocks or global error handlers
            }
            if (toast) {
                toast.show(result.message, "success", 5000);
            }
            const updatedData = members.filter(
                (item: any) => item.id !== memberId
            );
            setMembers((updatedData));
            setDeleted(true);
        } catch (error) {
            console.error("Error submitting form:", error);
            if (toast) {
                toast.show("An error occurred. Please try again.", "error", 5000);
            } else {
                alert("An error occurred. Please try again.");
            }
        };
    }

    return (
        <Container className='text-text_color py-6 px-4 relative bg-main_background scroll-stable'>
            <div onClick={() => setShowDetails(false)} className='hidden md:block absolute top-0 right-0 border border-border_color rounded-md m-2 cursor-pointer'><CloseIcon /></div>
            {loadingDetails ? <Loading />
            : <>
                {deleted && <div className='bg-field_color text-text_color p-2 border border-border_color border-dashed rounded-md my-4'><span className='inline-block align-bottom pr-1'><Info /></span>Member deleted</div>}
                <div className='flex gap-2 items-center w-full pb-3'>
                    <div className='border border-border_color p-2 rounded-md relative'>
                        {data?.generalInformation.gender === 'Male' ? <Male2 /> : <Female2 />}
                        {data?.generalInformation.deceased && <span className='absolute -bottom-2 -right-2'><Condolences /></span>}
                    </div>
                    <div className='w-full'>
                        <p onClick={() => handleMemberSearch(data?.generalInformation.name)} className='text-lg font-semibold flex items-center'>
                            <span className='hover:underline cursor-context-menu'>{data?.generalInformation.name || 'Name Unavailable'}</span>
                            {data?.generalInformation.verified && <span className='pl-2'><Verified /></span>}
                        </p>

                        {data?.generalInformation.birthDate && data?.generalInformation.birthMonth && (
                            <div className='flex items-baseline gap-1 text-sm'>
                                <p>Born At :</p>
                                <p>{`${data?.generalInformation.birthDate} ${format(`${data?.generalInformation.birthMonth}`, 'MMM')} ${data?.generalInformation.birthYear ? data.generalInformation.birthYear : ''}`}</p>
                            </div>
                        )}

                        {data?.generalInformation.deceased ?
                            data?.generalInformation.deathMonth && data?.generalInformation.deathYear 
                            ?  <div className='flex items-baseline gap-1 text-sm'>
                                    <p>Died At :</p>
                                    <p>{`${data?.generalInformation.deathDate ? data?.generalInformation.deathDate : ''} ${format(`${data?.generalInformation.deathMonth}`, 'MMM')} ${data?.generalInformation.deathYear}`}</p>
                                </div>
                            : <p className='text-sm'>Deceased</p>
                            : ''
                        }
                    </div>
                </div>
                <div className='ml-auto mr-0 w-fit'>{data?.descendant ? '-- Descendant -- ' : '-- Non-descendant -- '}</div>
                {(data?.relationInformation) &&
                <>
                    <div className='flex pt-3 items-center'>
                        <p className='font-semibold whitespace-nowrap pr-4'>Relation Information</p>
                        <p className='border-t border-border_color w-full'></p>
                    </div>
                    <div className='pl-1'>
                        <div className='flex flex-wrap border-l border-border_color pl-2'>
                            {data?.relationInformation.father && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Father</div>
                                    <div onClick={() => handleMemberSearch(data?.relationInformation.father)} className={`w-3/5 md:leading-7 hover:underline cursor-context-menu ${data?.relationInformation.v_father ? 'text-text_color': 'text-text_color/70 underline decoration-wavy'}`}>{data?.relationInformation.father}</div>
                                </>
                            )}
                            {data?.relationInformation.mother && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Mother</div>
                                    <div onClick={() => handleMemberSearch(data?.relationInformation.mother)} className={`w-3/5 md:leading-7 hover:underline cursor-context-menu ${data?.relationInformation.v_mother ? 'text-text_color': 'text-text_color/70 underline decoration-wavy'}`}>{data?.relationInformation.mother}</div>
                                </>
                            )}
                            {data?.relationInformation.siblings?.length > 0 && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Siblings</div>
                                    <div className='w-3/5 md:leading-7'>
                                        {data?.relationInformation.siblings?.map((sibling: { name: string, verified: boolean }, index: number) => (
                                            <span onClick={() => handleMemberSearch(sibling.name)} key={index} className={`${sibling.verified ? 'text-text_color': 'text-text_color/70 underline decoration-wavy'} hover:underline cursor-context-menu`} >
                                            {sibling.name}
                                            {/* Add a comma if it's not the last sibling, otherwise add a period */}
                                            {index < data.relationInformation.siblings.length - 1 && ', ' }
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                            {data?.relationInformation.nonDescendantRelations?.fatherName && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Father</div>
                                    <div className='w-3/5 md:leading-7'>{data?.relationInformation.nonDescendantRelations?.fatherName}</div>
                                </>
                            )}
                            {data?.relationInformation.nonDescendantRelations?.motherName && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Mother</div>
                                    <div className='w-3/5 md:leading-7'>{data?.relationInformation.nonDescendantRelations?.motherName}</div>
                                </>
                            )}
                            {data?.relationInformation.nonDescendantRelations?.siblingNames && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Siblings</div>
                                    <div className='w-3/5 md:leading-7'>{data?.relationInformation.nonDescendantRelations?.siblingNames}</div>
                                </>
                            )}
                            {data?.descendant ? data?.relationInformation.partner &&
                                    <>
                                        <div className='w-2/5 md:leading-7 font-medium capitalize'>Partner</div>
                                        <div onClick={() => handleMemberSearch(data?.relationInformation.partner)} className={`w-3/5 md:leading-7 hover:underline cursor-context-menu ${data?.relationInformation.v_partner ? 'text-text_color': 'text-text_color/70 underline decoration-wavy'}`}>{data?.relationInformation.partner}</div>
                                    </> 
                                    :<>
                                        <div className='w-2/5 md:leading-7 font-medium capitalize'>Partner</div>
                                        <div className={`w-3/5 md:leading-7 `}>
                                            {data?.relationInformation.partner 
                                            ? <span onClick={() => handleMemberSearch(data?.relationInformation.partner)} className={`${data?.relationInformation.v_partner ? 'text-text_color': 'text-text_color/70 underline decoration-wavy'} hover:underline cursor-context-menu`}>{data?.relationInformation.partner}</span>
                                            : <span className='italic'>-- Partner Unassigned --</span>}
                                        </div>
                                    </> 
                            }

                            {data?.relationInformation.children && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Children</div>
                                    <div className='w-3/5 md:leading-7'>
                                    {data.relationInformation.children.map((child: { name: string, verified: boolean }, index: number) => (
                                        <span key={index} onClick={() => handleMemberSearch(child.name)} className={`hover:underline cursor-context-menu ${child.verified ? 'text-text_color': 'text-text_color/70 underline decoration-wavy'}`}>
                                            {child.name}
                                            {index < data.relationInformation.children.length - 1 && ", "}
                                        </span>
                                    ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>}

                {(data?.contactInformation) &&
                <>
                    <div className='flex pt-3 items-center'>
                        <p className='font-semibold whitespace-nowrap pr-4'>Contact Information</p>
                        <p className='border-t border-border_color w-full'></p>
                    </div>
                    <div className='pl-1'>
                        <div className='flex flex-wrap mb-1 border-l border-border_color pl-2'>
                            {data?.contactInformation.phoneNumber && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Phone no.</div>
                                    <div className='w-3/5 md:leading-7'>{data?.contactInformation.phoneNumber}</div>
                                </>
                            )}
                            {data?.contactInformation.address && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Location</div>
                                    <div className='w-3/5 md:leading-7'>{data?.contactInformation.address}</div>
                                </>
                            )}
                        </div>
                    </div>
                </>
                }

                {(data?.personalInformation) &&
                <>
                    <div className='flex pt-3 items-center'>
                        <p className='font-semibold whitespace-nowrap pr-4'>Personal Information</p>
                        <p className='border-t border-border_color w-full'></p>
                    </div>
                    <div className='pl-1'>
                        <div className='flex flex-wrap pb-1 border-l border-border_color pl-2'>
                            {data?.personalInformation.occupation && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Occupation</div>
                                    <div className='w-3/5 md:leading-7'>{data?.personalInformation.occupation}</div>
                                </>
                            )}
                            {data?.personalInformation.education && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Education</div>
                                    <div className='w-3/5 md:leading-7'>{data?.personalInformation.education}</div>
                                </>
                            )}
                        </div>
                    </div>
                </>}
                <div className='flex flex-col mt-4 gap-2'>
                    <HoldButton holdDuration={3000} buttonText={data?.generalInformation.verified ? 'Switch To Unverified' : 'Switch To Verified'} onClick={() => handleVerification(data?.generalInformation.id)} />
                    <HoldButton type='outline' buttonText='Delete Member' onClick={() => handleDelete(data?.generalInformation.id)} />
                </div>
            </>}
        </Container>
    );
}