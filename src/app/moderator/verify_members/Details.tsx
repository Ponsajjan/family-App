'use client'

import Container from '@/components/Container';
import { HoldButton } from '@/components/HoldButton';
import Loading from '@/components/Loading';
import { DateInfo, InformationSection, MemberItem, MemberItemVerify, MemberListItemVerify } from '@/components/MemberDetailsComponents';
import { useToast } from '@/components/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { CloseIcon, Condolences, Female2, Info, Male2, Verified } from '@/utils/Icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { appFetch } from "@/utils/appFetch";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateAccountIssues } from '@/store/slices/termsSlice';
import { useSWRConfig } from 'swr';

export default function NewMemberDetails({
    showDetailsFor,
    setShowDetails,
    handleMemberSearch,
    setMembers,
    members,
    selectedFilter,
    preparingList,
    setPreparingList,
}: any) {
    const toast = useToast();
    const router = useRouter();
    const { mutate } = useSWRConfig();
    const { logout } = useAuth();
    const dispatch = useDispatch();
    const { anyOtherAccountHasIssues } = useSelector((state: RootState) => state.terms);
    const [data, setData] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        if (!showDetailsFor.id) return;

        const fetchMemberDetails = async () => {
            setLoadingDetails(true);
            setError(null);
            try {
                const res = await appFetch(`/api/moderator/verifyMember/${showDetailsFor.id}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to fetch member details");
                }
                const result = await res.json();
                if (result.data) {
                    setData(result.data);
                    setDeleted(false);
                }
            } catch (err: any) {
                console.error("[NewMemberDetails] Fetch failed:", err);
                setError(err.message);
            } finally {
                setLoadingDetails(false);
            }
        };

        fetchMemberDetails();
    }, [showDetailsFor.id]);


    const handleVerification = async (memberId: number) => {
        try {
            setPreparingList(true)
            const response = await appFetch(`/api/moderator/verifyMember/${memberId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const result = await response.json();

            // Handle 401 Unauthorized
            if (response.status === 401) {
                logout()
                return
            }

            if (response.status === 403) {
                router.push('/moderator/login');
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
                const updatedData = members.filter((item: any) => item.id !== memberId);
                setMembers(updatedData);
                if (updatedData.length === 0) {
                    dispatch(updateAccountIssues({
                        hasChanges: false,
                        anyOtherAccountHasIssues: anyOtherAccountHasIssues
                    }));
                }
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
            mutate('/api/moderator', undefined, { revalidate: true });
        } catch (error: any) {
            console.error("Error verifying member:", error);
            toast?.show(error.message || "An error occurred. Please try again.", "error", 5000);
        } finally {
            setPreparingList(false)
        }
    };


    const handleDelete = async (memberId: number) => {
        try {
            setPreparingList(true)
            const response = await appFetch(`/api/moderator/verifyMember/${memberId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const result = await response.json();

            // Handle 401 Unauthorized
            if (response.status === 401) {
                logout()
                return
            }

            if (response.status === 403) {
                router.push('/moderator/login');
                toast?.show("Unauthorized access. Please login.", "error", 5000);
                return;
            }
            // Handle API response
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong");
                // throw allows the error to be caught and handled by any surrounding `try...catch` blocks or global error handlers
            }
            toast?.show(result.message, "success", 5000);
            const updatedData = members.filter(
                (item: any) => item.id !== memberId
            );
            setMembers(updatedData);
            if (updatedData.length === 0) {
                dispatch(updateAccountIssues({
                    hasChanges: false,
                    anyOtherAccountHasIssues: anyOtherAccountHasIssues
                }));
            }
            setDeleted(true);
            mutate('/api/moderator', undefined, { revalidate: true });
        } catch (error: any) {
            console.error("Error submitting form:", error);
            toast?.show(error.message || "An error occurred. Please try again.", "error", 5000);
        } finally {
            setPreparingList(false)
        }
    }

    if (error) return <div className='p-4'>Error: {error}</div>;
    if (!data && !loadingDetails) return <div className='p-4 loading-text'>No data found</div>;

    return (
        <Container className='text-text_color relative bg-main_background'>
            {/* Sticky Close Button Container */}
            <div className="sticky top-0 z-30 h-0 w-full pointer-events-none">
                <div className="relative w-full h-0">
                    <div
                        onClick={() => setShowDetails(false)}
                        className="absolute top-4 right-4 border border-border_color rounded-md cursor-pointer z-20 pointer-events-auto"
                    >
                        <CloseIcon />
                    </div>
                </div>
            </div>
            {loadingDetails ? <Loading /> : (
                <>
                    <div className='p-4 sticky top-0 z-10 bg-main_background border-b border-border_color pb-1.5 md:pb-3'>
                        {deleted && <div className='bg-field_color text-text_color p-2 border border-border_color border-dashed rounded-md mt-8 mb-2'><span className='inline-block align-bottom pr-1'><Info /></span>Member deleted</div>}
                        <div className='flex gap-2 items-center w-full'>
                            <div className='border border-border_color p-2 rounded-md relative'>
                                {data?.generalInformation.gender === 'Male' ? <Male2 /> : <Female2 />}
                                {data?.generalInformation.deceased && <span className='absolute -bottom-2 -right-2'><Condolences /></span>}
                            </div>
                            <div className='w-full'>
                                <p onClick={() => handleMemberSearch(data?.generalInformation.name)} className='text-lg font-semibold flex items-center'>
                                    <span className='hover:underline cursor-pointer'>{data?.generalInformation.name || 'Name Unavailable'}</span>
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
                        <div className='ml-auto mr-0 w-fit'>{data?.descendant && !data?.isMainMember ? '-- Descendant -- ' : !data?.isMainMember ? '-- Non-descendant -- ' : '-- Main Member --'}</div>
                    </div>
                    <div className='px-4 pb-6'>
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

                                {data?.descendant && !(data?.relationInformation.father || data?.relationInformation.mother) && !data?.isMainMember && (
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
                                <MemberItem label="Address" value={data.contactInformation.address} />
                                <MemberItem label="City/Locality" value={data.contactInformation.city} />
                                <MemberItem label="District" value={data.contactInformation.district} />
                                <MemberItem label="State/Region" value={data.contactInformation.state} />
                                <MemberItem label="Country" value={data.contactInformation.country} />
                            </InformationSection>
                        }

                        {(data?.personalInformation) &&
                            <InformationSection title="Personal Information">
                                <MemberItem label="Birth Place" value={data.personalInformation.birthPlace} />
                                <MemberItem label="Occupation" value={data.personalInformation.occupation} />
                                <MemberItem label="Education" value={data.personalInformation.education} />
                            </InformationSection>}

                        {/* Additional Information */}
                        {(data?.additionalInformation) && (
                            <InformationSection title="Additional Information">
                                <MemberItem value={data.additionalInformation.additionalInfo} />
                            </InformationSection>
                        )}

                        <div className='flex flex-col mt-6 gap-2'>
                            <HoldButton disabled={deleted || preparingList} holdDuration={3000} buttonText={data?.generalInformation.verified ? 'Switch To Unverified' : 'Switch To Verified'} onClick={() => handleVerification(data?.generalInformation.id)} />
                            <HoldButton disabled={deleted || preparingList} type='outline' buttonText='Delete Member' onClick={() => handleDelete(data?.generalInformation.id)} />
                        </div>
                    </div>
                </>
            )}
        </Container>
    );
}