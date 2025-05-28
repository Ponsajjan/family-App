'use client'
import Container from '@/components/Container';
import { CloseIcon, Condolences, Female2, Male2, Verified } from '@/utils/Icons';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import { getCookie } from 'cookies-next';

export default function Details({ showMember, openDetails }: any) {
      const token = getCookie('token');
      const [data, setData] = useState<any>(null);
      const [loadingDetails, setLoadingDetails] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
        const fetchMemberDetails = async () => {
          if (!showMember) return;
          
          try {
            setError(null)
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
          } catch (err) {
            console.error('Error fetching data:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
          } finally {
            setLoadingDetails(false);
          }
        };
      
        fetchMemberDetails();
      }, [showMember, token]);

      if (error) return <div className='p-4'>Error: {error}</div>;
      if (!data && !loadingDetails) return <div className='p-4 loading-text'>No data found</div>;

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
                        <p className='font-semibold  pr-4 whitespace-nowrap'>Relation Information</p>
                        <p className='border-t border-border_color w-full'></p>
                    </div>
                    <div className='pl-1'>
                        <div className='flex flex-wrap border-l border-border_color pl-2'>
                            {data?.relationInformation.father && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Father</div>
                                    <div className='w-3/5 md:leading-7 '>{data?.relationInformation.father}</div>
                                </>
                            )}
                            {data?.relationInformation.mother && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Mother</div>
                                    <div className='w-3/5 md:leading-7 '>{data?.relationInformation.mother}</div>
                                </>
                            )}
                            {data?.relationInformation.siblings && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Siblings</div>
                                    <div className='w-3/5 md:leading-7 flex flex-wrap'>
                                        {data.relationInformation.siblings
                                            .sort((a: any, b: any) => a.order - b.order)
                                            .map((sibling: { name: string, order: number }, index: number) => (
                                                <span key={index} className={` ${index > 0 && 'pl-1'}`}>
                                                    {sibling.name}
                                                    {index < data.relationInformation.siblings.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                    </div>
                                </>
                            )}
                            {data?.relationInformation.nonDescendantRelations?.fatherName && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Father</div>
                                    <div className='w-3/5 md:leading-7 '>{data?.relationInformation.nonDescendantRelations?.fatherName}</div>
                                </>
                            )}
                            {data?.relationInformation.nonDescendantRelations?.motherName && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Mother</div>
                                    <div className='w-3/5 md:leading-7 '>{data?.relationInformation.nonDescendantRelations?.motherName}</div>
                                </>
                            )}
                            {data?.relationInformation.nonDescendantRelations?.siblingNames && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Siblings</div>
                                    <div className='w-3/5 md:leading-7 '>{data?.relationInformation.nonDescendantRelations?.siblingNames}</div>
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
                                    <div className='w-3/5 md:leading-7 flex flex-wrap'>
                                        {data.relationInformation.children
                                            .sort((a: any, b: any) => a.order - b.order)
                                            .map((child: { name: string }, index: number) => 
                                                <span key={index} className={` ${index > 0 && 'pl-1'}`}>
                                                    {child.name}
                                                    {index < data.relationInformation.children.length - 1 ? ', ' : ''}
                                                </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>}

                {(data?.contactInformation) &&
                <>
                    <div className='flex pt-3 items-center'>
                        <p className='font-semibold  pr-4 whitespace-nowrap'>Contact Information</p>
                        <p className='border-t border-border_color w-full'></p>
                    </div>
                    <div className='pl-1'>
                        <div className='flex flex-wrap mb-1 border-l border-border_color pl-2'>
                            {data?.contactInformation.phoneNumber && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Phone no.</div>
                                    <div className='w-3/5 md:leading-7 flex flex-wrap'>{data?.contactInformation.phoneNumber}</div>
                                </>
                            )}
                            {data?.contactInformation.address && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Location</div>
                                    <div className='w-3/5 md:leading-7 flex flex-wrap'>{data?.contactInformation.address}</div>
                                </>
                            )}
                        </div>
                    </div>
                </>
                }

                {(data?.personalInformation) &&
                <>
                    <div className='flex pt-3 items-center'>
                        <p className='font-semibold  pr-4 whitespace-nowrap'>Personal Information</p>
                        <p className='border-t border-border_color w-full'></p>
                    </div>
                    <div className='pl-1'>
                        <div className='flex flex-wrap pb-1 border-l border-border_color pl-2'>
                            {data?.personalInformation.occupation && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Occupation</div>
                                    <div className='w-3/5 md:leading-7 flex flex-wrap'>{data?.personalInformation.occupation}</div>
                                </>
                            )}
                            {data?.personalInformation.education && (
                                <>
                                    <div className='w-2/5 md:leading-7 font-medium capitalize'>Education</div>
                                    <div className='w-3/5 md:leading-7 flex flex-wrap'>{data?.personalInformation.education}</div>
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
