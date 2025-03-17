'use client'
import { ButtonOutline, ButtonSolid, LinkButtonOutline } from '@/components/Button';
import Container from '@/components/Container';
import HoldButton from '@/components/HoldButton';
import { CloseIcon, Condolences, Female2, Male2, Verified } from '@/utils/Icons';
import { format } from 'date-fns';
import React from 'react';

export default function NewMemberDetails({ data, openDetails }: any) {

    return (
        <Container className='text-text_color py-6 px-4 relative bg-main_background scroll-stable'>
            <div onClick={() => openDetails(false)} className='hidden md:block absolute top-0 right-0 border border-border_color rounded-md m-2 cursor-pointer'><CloseIcon /></div>
            <div className='flex gap-2 items-center w-full pb-3'>
                <div className='border border-border_color p-2 rounded-md relative'>
                    {data?.gender === 'Male' ? <Male2 /> : <Female2 />}
                    {data?.deceased && <span className='absolute -bottom-2 -right-2'><Condolences /></span>}
                </div>
                <div className='w-full'>
                    <p className='text-lg font-semibold flex items-center'>
                        <span>{data?.name || 'Name Unavailable'}</span>
                        {data?.verified && <span className='pl-2'><Verified /></span>}
                    </p>

                    {data?.birthDate && data?.birthMonth && (
                        <div className='flex items-baseline gap-1 text-sm'>
                            <p>Born At :</p>
                            <p>{`${data?.birthDate} ${format(`${data?.birthMonth}`, 'MMM')} ${data?.birthYear ? data.birthYear : ''}`}</p>
                        </div>
                    )}

                    {data?.deceased ?
                        data?.deathMonth && data?.deathYear 
                        ?  <div className='flex items-baseline gap-1 text-sm'>
                                <p>Died At :</p>
                                <p>{`${data?.deathDate ? data?.deathDate : ''} ${format(`${data?.deathMonth}`, 'MMM')} ${data?.deathYear}`}</p>
                            </div>
                        : <p className='text-sm'>Deceased</p>
                        : ''
                    }
                </div>
            </div>


            {(data?.father ||
                data?.mother ||
                data?.partner ||
                data?.fatherOf?.length > 0 ||
                data?.motherOf?.length > 0 ||
                data?.nonDescendantRelation[0]?.fatherName ||
                data?.nonDescendantRelation[0]?.motherName ||
                data?.nonDescendantRelation[0]?.siblingNames) &&
            <>
                <div className='flex pt-3 items-center'>
                    <p className='font-semibold whitespace-nowrap pr-4'>Relation Information</p>
                    <p className='border-t border-border_color w-full'></p>
                </div>
                <div className='pl-1'>
                    <div className='flex flex-wrap border-l border-border_color pl-2'>
                        {data?.father && (
                            <>
                                <div className='w-2/5 md:leading-7 font-medium capitalize'>Father</div>
                                <div className='w-3/5 md:leading-7'>{data?.father.name}</div>
                            </>
                        )}
                        {data?.mother && (
                            <>
                                <div className='w-2/5 md:leading-7 font-medium capitalize'>Mother</div>
                                <div className='w-3/5 md:leading-7'>{data?.mother.name}</div>
                            </>
                        )}
                        {data?.siblings?.length > 0 && (
                            <>
                                <div className='w-2/5 md:leading-7 font-medium capitalize'>Siblings</div>
                                <div className='w-3/5 md:leading-7'>{data?.siblings?.join(", ")}</div>
                            </>
                        )}
                        {data?.nonDescendantRelation[0]?.fatherName && (
                            <>
                                <div className='w-2/5 md:leading-7 font-medium capitalize'>Father</div>
                                <div className='w-3/5 md:leading-7'>{data?.nonDescendantRelation[0]?.fatherName}</div>
                            </>
                        )}
                        {data?.nonDescendantRelation[0]?.motherName && (
                            <>
                                <div className='w-2/5 md:leading-7 font-medium capitalize'>Mother</div>
                                <div className='w-3/5 md:leading-7'>{data?.nonDescendantRelation[0]?.motherName}</div>
                            </>
                        )}
                        {data?.nonDescendantRelation[0]?.siblingNames && (
                        <>
                            <div className='w-2/5 md:leading-7 font-medium capitalize'>Siblings</div>
                            <div className='w-3/5 md:leading-7'>{data?.nonDescendantRelation[0]?.siblingNames}</div>
                        </>
                        )}
                        {data?.partner && (
                            <>
                                <div className='w-2/5 md:leading-7 font-medium capitalize'>Partner</div>
                                <div className='w-3/5 md:leading-7'>{data?.partner.name}</div>
                            </>
                        )}

                        {(data?.fatherOf.length > 0 || data?.motherOf.length > 0) &&
                        <div className='w-2/5 md:leading-7 font-medium capitalize'>Children</div>}
                        {data?.fatherOf.length > 0 && (  
                            <div className='w-3/5 md:leading-7'>
                                {data.fatherOf.map((child: { name: string }) => child.name).join(", ")}
                            </div>
                        )}
                        {data?.motherOf.length > 0 && (
                            <div className='w-3/5 md:leading-7'>
                                {data.motherOf.map((child: { name: string }) => child.name).join(", ")}.
                            </div>
                        )}
                    </div>
                </div>
            </>}

            {(data?.phoneNumber || data?.address) &&
            <>
                <div className='flex pt-3 items-center'>
                    <p className='font-semibold whitespace-nowrap pr-4'>Contact Information</p>
                    <p className='border-t border-border_color w-full'></p>
                </div>
                <div className='pl-1'>
                    <div className='flex flex-wrap mb-1 border-l border-border_color pl-2'>
                        {data?.phoneNumber && (
                            <>
                                <div className='w-2/5 md:leading-7 font-medium capitalize'>Phone no.</div>
                                <div className='w-3/5 md:leading-7'>{data?.phoneNumber}</div>
                            </>
                        )}
                        {data?.address && (
                            <>
                                <div className='w-2/5 md:leading-7 font-medium capitalize'>Location</div>
                                <div className='w-3/5 md:leading-7'>{data?.address}</div>
                            </>
                        )}
                    </div>
                </div>
            </>
            }

            {(data?.occupation || data?.education) &&
            <>
                <div className='flex pt-3 items-center'>
                    <p className='font-semibold whitespace-nowrap pr-4'>Personal Information</p>
                    <p className='border-t border-border_color w-full'></p>
                </div>
                <div className='pl-1'>
                    <div className='flex flex-wrap pb-1 border-l border-border_color pl-2'>
                        {data?.occupation && (
                            <>
                                <div className='w-2/5 md:leading-7 font-medium capitalize'>Occupation</div>
                                <div className='w-3/5 md:leading-7'>{data?.occupation}</div>
                            </>
                        )}
                        {data?.education && (
                            <>
                                <div className='w-2/5 md:leading-7 font-medium capitalize'>Education</div>
                                <div className='w-3/5 md:leading-7'>{data?.education}</div>
                            </>
                        )}
                    </div>
                </div>
            </>
            }
            <div className='flex flex-col mt-4 gap-2'>
                <HoldButton buttonText={data?.verified ? 'Switch To Unverify' : 'Switch To Verified'} onClick={() => console.log("hi")} />
                <HoldButton type='outline' buttonText='Delete Member' onClick={() => console.log("hi")} />
                {/* <LinkButtonOutline buttonText='Edit Member' linkto='/moderator/edit_member/1'/> */}
            </div>

        </Container>
    );
}