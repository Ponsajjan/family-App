'use client'

import Container from '@/components/Container';
import { HoldButton } from '@/components/HoldButton';
import Loading from '@/components/Loading';
import { DateInfo, InformationSection, MemberItem, MemberItemVerify, MemberListItemVerify } from '@/components/MemberDetailsComponents';
import { useToast } from '@/components/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { CloseIcon, Condolences, Female2, Info, Male2, Verified } from '@/utils/Icons';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function NewMemberDetails({ showDetailsFor, setShowDetails, handleMemberSearch, setMembers, members, selectedFilter }: any) {
    const toast = useToast();
    const router = useRouter();
    const {logout} = useAuth();
    const [data, setData] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [deleted, setDeleted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMembers() {
            try {
                setError(null)
                setDeleted(false)
                setLoadingDetails(true)
                const response = await fetch(`/api/moderator/verifyMember/${showDetailsFor.id}`,
                    {
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    }
                );
                // Handle 401 Unauthorized
                if (response.status === 401) {
                    logout();
                    return;
                }
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch member details");
                  }
        
                const member = await response.json();
        
                setData(member.data);
            } catch (error:any) {
                console.error('Error fetching data:', error);
                setError(error.message || 'Unknown error occurred');
            } finally {
                setLoadingDetails(false)
            }
        }
    
        if (showDetailsFor.id) {
            fetchMembers();
        }

    }, [toast, showDetailsFor, router, logout]);


    const handleVerification = async (memberId: number) => {
        try {
            const response = await fetch(`/api/moderator/verifyMember/${memberId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const result = await response.json();

            // Handle 401 Unauthorized
            if (response.status === 401) {
                router.push('/terms/login');
                toast?.show("Unauthorized access. Please login.", "error", 5000);
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
    
        } catch (error: any) {
            console.error("Error verifying member:", error);
            toast?.show(error.message || "An error occurred. Please try again.", "error", 5000);
        }
    };
    

    const handleDelete = async (memberId: number) => {
        try {
            const response = await fetch(`/api/moderator/verifyMember/${memberId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const result = await response.json();

            // Handle 401 Unauthorized
            if (response.status === 401) {
                router.push('/terms/login');
                toast?.show("Unauthorized access. Please login.", "error", 5000);
                return;
            }
            // Handle API response
            if (!response.ok) {
                toast?.show(result.error || "Something went wrong", "error", 5000);
                throw new Error(result.error || "Something went wrong");
                // throw allows the error to be caught and handled by any surrounding `try...catch` blocks or global error handlers
            }
            toast?.show(result.message, "success", 5000);
            const updatedData = members.filter(
                (item: any) => item.id !== memberId
            );
            setMembers(updatedData);
            setDeleted(true);
        } catch (error: any) {
            console.error("Error submitting form:", error);
            toast?.show(error.message || "An error occurred. Please try again.", "error", 5000);
        };
    }

    if (error) return <div className='p-4'>Error: {error}</div>;
    if (!data && !loadingDetails) return <div className='p-4 loading-text'>No data found</div>;

    return (
        <Container className='text-text_color py-6 px-4 relative bg-main_background'>
            <div onClick={() => setShowDetails(false)} className='hidden md:block absolute top-0 right-0 border border-border_color rounded-md m-2 cursor-pointer'>
                <CloseIcon />
            </div>
            {loadingDetails ? <Loading /> : (
            <>
                {deleted && <div className='bg-field_color text-text_color p-2 border border-border_color border-dashed rounded-md my-4'><span className='inline-block align-bottom pr-1'><Info /></span>Member deleted</div>}
                <div className='flex gap-2 items-center w-full pb-1 md:pb-3'>
                    <div className='border border-border_color p-2 rounded-md relative'>
                        {data?.generalInformation.gender === 'Male' ? <Male2 /> : <Female2 />}
                        {data?.generalInformation.deceased && <span className='absolute -bottom-2 -right-2'><Condolences /></span>}
                    </div>
                    <div className='w-full'>
                        <p onClick={() => handleMemberSearch(data?.generalInformation.name)} className='text-lg font-semibold flex items-center'>
                            <span className='hover:underline cursor-context-menu'>{data?.generalInformation.name || 'Name Unavailable'}</span>
                            {data?.generalInformation.verified && <span className='pl-2'><Verified /></span>}
                        </p>

                        <DateInfo 
                            prefix="Born At"
                            date={data.generalInformation.birthDate}
                            month={data.generalInformation.birthMonth}
                            year={data.generalInformation.birthYear}
                        />

                        {data.generalInformation.deceased && (
                            <DateInfo 
                                prefix="Died At"
                                date={data.generalInformation.deathDate}
                                month={data.generalInformation.deathMonth}
                                year={data.generalInformation.deathYear}
                                fallback="Deceased"
                            />
                        )}
                    </div>
                </div>
                <div className='ml-auto mr-0 w-fit'>{data?.descendant ? '-- Descendant -- ' : '-- Non-descendant -- '}</div>
                {(data?.relationInformation) &&
                <InformationSection title="Relation Information">
                    {data?.relationInformation.father && (
                        <MemberItemVerify 
                            label="Father"
                            name={data?.relationInformation.father}
                            isVerified={data?.relationInformation.v_father}
                            onClick={() => handleMemberSearch(data?.relationInformation.father!)}
                        />
                    )}
                    
                    {data?.relationInformation.mother && (
                        <MemberItemVerify 
                            label="Mother"
                            name={data?.relationInformation.mother}
                            isVerified={data?.relationInformation.v_mother}
                            onClick={() => handleMemberSearch(data?.relationInformation.mother!)}
                        />
                    )}

                    {data?.descendant && !(data?.relationInformation.father || data?.relationInformation.mother) && (
                        <MemberItemVerify 
                            label="Parents"
                            name="-- Unassigned --"
                            isCustom
                        />
                    )}

                    {/* Non-descendant parents */}
                    {data?.relationInformation.nonDescendantRelations?.fatherName && (
                        <MemberItemVerify 
                            label="Father"
                            name={data?.relationInformation.nonDescendantRelations.fatherName}
                        />
                    )}

                    {data?.relationInformation.nonDescendantRelations?.motherName && (
                        <MemberItemVerify 
                            label="Mother"
                            name={data?.relationInformation.nonDescendantRelations.motherName}
                        />
                    )}

                    {data?.relationInformation.partner && (
                        <MemberItemVerify 
                            label="Partner"
                            name={data?.relationInformation.partner}
                            isVerified={data?.relationInformation.v_partner}
                            onClick={data?.relationInformation.partner ? () => handleMemberSearch(data?.relationInformation.partner!) : undefined}
                        />
                    )}

                    {!data?.descendant && !data?.relationInformation.partner && (
                        <MemberItemVerify 
                            label="Partner"
                            name="-- Unassigned --"
                            isCustom
                        />
                    )}

                    {/* Children */}
                    {data?.relationInformation.children && data?.relationInformation.children.length > 0 && (
                        <MemberListItemVerify 
                            label={data?.relationInformation.children.length > 1 ? 'Children' : 'Child'}
                            items={data?.relationInformation.children}
                            onItemClick={(name) => handleMemberSearch(name)}
                        />
                    )}

                    {/* Siblings */}
                    {data?.relationInformation.siblings && data?.relationInformation.siblings.length > 0 && (
                        <MemberListItemVerify 
                            label={data?.relationInformation.siblings.length > 1 ? 'Siblings' : 'Sibling'}
                            items={data?.relationInformation.siblings}
                            onItemClick={(name) => handleMemberSearch(name)}
                        />
                    )}

                    {/* Non-descendant siblings */}
                    {data?.relationInformation.nonDescendantRelations?.siblingNames && (
                        <MemberItemVerify 
                            label={data?.relationInformation.nonDescendantRelations.siblingNames.split(',').length > 1 ? 'Siblings' : 'Sibling'}
                            name={data?.relationInformation.nonDescendantRelations.siblingNames}
                        />
                    )}

                </InformationSection>}

                {(data?.contactInformation) &&
                <InformationSection title="Contact Information">
                    <MemberItem label="Phone no." value={data.contactInformation.phoneNumber} />
                    <MemberItem label="Location" value={data.contactInformation.address} />
                </InformationSection>
                }

                {(data?.personalInformation) &&
                <InformationSection title="Personal Information">
                    <MemberItem label="Occupation" value={data.personalInformation.occupation} />
                    <MemberItem label="Address" value={data.personalInformation.education} />
                </InformationSection>}
                <div className='flex flex-col mt-6 gap-2'>
                    <HoldButton disabled={deleted} holdDuration={3000} buttonText={data?.generalInformation.verified ? 'Switch To Unverified' : 'Switch To Verified'} onClick={() => handleVerification(data?.generalInformation.id)} />
                    <HoldButton disabled={deleted} type='outline' buttonText='Delete Member' onClick={() => handleDelete(data?.generalInformation.id)} />
                </div>
            </>)}
        </Container>
    );
}