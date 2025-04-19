'use client'
import Container from '@/components/Container';
import { CloseIcon, Condolences, Female2, Male2, Verified } from '@/utils/Icons';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import { getCookie } from 'cookies-next';
import { useToast } from '@/components/Toast';

export default function Details({ showMember, openDetails }: any) {
      const toast = useToast();
      const token = getCookie('token');
      const [data, setData] = useState<any>(null);
      const [loadingDetails, setLoadingDetails] = useState(true);
      
      useEffect(() => {
        const fetchMemberDetails = async () => {
          if (!showMember) return;
          
          try {
            setLoadingDetails(true);
            const response = await fetch(`/api/relatives/${showMember}`, {
              method: 'GET',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              },
              cache: 'no-store',
            });
      
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update member");
              }
      
            const { data } = await response.json();
            setData(data);
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast?.show(message, "error", 5000) || alert(message);
          } finally {
            setLoadingDetails(false);
          }
        };
      
        fetchMemberDetails();
      }, [showMember, token]);

    return (
        <Container className='text-text_color py-6 px-4 relative bg-main_background scroll-stable'>
            <div onClick={() => openDetails(false)} className='hidden md:block absolute top-0 right-0 border border-border_color rounded-md m-2 cursor-pointer'><CloseIcon /></div>
            {loadingDetails ? <Loading />
            : <>
                <div className='flex gap-2 items-center w-full pb-3'>
                    <div className='border border-border_color p-2 rounded-md relative'>
                        {data?.generalInformation.gender === 'Male' ? <Male2 /> : <Female2 />}
                        {data?.generalInformation.deceased && <span className='absolute -bottom-2 -right-2'><Condolences /></span>}
                    </div>
                    <div className='w-full'>
                        <p className='text-lg font-semibold flex items-center'>
                            <span>{data?.generalInformation.name || 'Name Unavailable'}</span>
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
                                    <div className='w-3/5 md:leading-7'>{data?.relationInformation.father}</div>
                                </>
                            )}
                            {data?.relationInformation.mother && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Mother</div>
                                    <div className='w-3/5 md:leading-7'>{data?.relationInformation.mother}</div>
                                </>
                            )}
                            {data?.relationInformation.siblings && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Siblings</div>
                                    <div className='w-3/5 md:leading-7'>
                                        {data.relationInformation.siblings
                                                .sort((a: any, b: any) => a.order - b.order)
                                                .map((sibling: { name: string, order: number }) => sibling.name)
                                                .join(", ")}
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
                            {data?.relationInformation.partner && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Partner</div>
                                    <div className='w-3/5 md:leading-7'>{data?.relationInformation.partner}</div>
                                </>
                            )}

                            {data?.relationInformation.children && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Children</div>
                                    <div className='w-3/5 md:leading-7'>
                                        {data.relationInformation.children
                                            .sort((a: any, b: any) => a.order - b.order)
                                            .map((child: { name: string, order: number }) => child.name)
                                            .join(", ")}
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
            </>
            }

        </Container>
    );
}
