import Container from '@/components/Container';
import { Birthday2, Deathday2, Female2, Male } from '@/utils/Icons';
import React from 'react';

export default function Details({ data }: any) {
    return (
        <Container className='text-text_color py-6'>
            <div className='flex gap-2 items-center w-full pb-3'>
                <div className='border border-border_color px-1 py-2 rounded-md'>
                    {data.gender === 'Male' ? <Male /> : <Female2 />}
                </div>
                <div className='flex justify-between items-center w-full'>
                    <p className='text-lg font-semibold'>{data?.name || 'Name Unavailable'}</p>

                    {data?.birthDate && data?.birthMonth && data?.birthYear && (
                        <div className='flex items-baseline gap-1 leading-5 text-sm'>
                            <p>Born At :</p>
                            <p>{`${data.birthDate} ${data.birthMonth} ${data.birthYear}`}</p>
                            <Birthday2 />
                        </div>
                    )}

                    {data?.deathDate && data?.deathMonth && (
                        <div className='flex items-baseline gap-1 leading-5 text-sm'>
                            <p>Died At :</p>
                            <p>{`${data.deathDate} ${data.deathMonth} ${data.deathYear}`}</p>
                            <Deathday2 />
                        </div>
                    )}
                </div>
            </div>


            {(data?.father || data?.partner) &&
            <div className='flex pt-3 items-center'>
                <p className='font-semibold whitespace-nowrap pr-4'>Relation Information</p>
                <p className='border-t border-border_color w-full'></p>
            </div>}
            <div className='pl-1'>
                <div className='flex flex-wrap border-l border-border_color pl-2'>
                    {data?.father && (
                        <>
                            <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Father</div>
                            <div className='w-3/5 leading-5 md:leading-7'>{data?.father}</div>
                        </>
                    )}
                    {data?.mother && (
                        <>
                            <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Mother</div>
                            <div className='w-3/5 leading-5 md:leading-7'>{data?.mother}</div>
                        </>
                    )}
                    {data?.siblings && (
                        <>
                            <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Siblings</div>
                            <div className='w-3/5 leading-5 md:leading-7'>{data?.siblings.join(', ')}</div>
                        </>
                    )}
                    {data?.partner && (
                        <>
                            <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Partner</div>
                            <div className='w-3/5 leading-5 md:leading-7'>{data?.partner}</div>
                        </>
                    )}
                    {data?.children && (
                        <>
                            <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Children</div>
                            <div className='w-3/5 leading-5 md:leading-7'>{data?.children.join(', ')}</div>
                        </>
                    )}
                </div>
            </div>

            {(data?.phoneNumber || data?.address) &&
            <div className='flex pt-3 items-center'>
                <p className='font-semibold whitespace-nowrap pr-4'>Contact Information</p>
                <p className='border-t border-border_color w-full'></p>
            </div>}
            <div className='pl-1'>
                <div className='flex flex-wrap pb-1 border-l border-border_color pl-2'>
                    {data?.phoneNumber && (
                        <>
                            <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Phone no.</div>
                            <div className='w-3/5 leading-5 md:leading-7'>{data?.phoneNumber}</div>
                        </>
                    )}
                    {data?.address && (
                        <>
                            <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Address</div>
                            <div className='w-3/5 leading-5 md:leading-7'>{data?.address}</div>
                        </>
                    )}
                </div>
            </div>

            {(data?.occupation || data?.education) &&
            <div className='flex pt-3 items-center'>
                <p className='font-semibold whitespace-nowrap pr-4'>Personal Information</p>
                <p className='border-t border-border_color w-full'></p>
            </div>}
            <div className='pl-1'>
                <div className='flex flex-wrap pb-1 border-l border-border_color pl-2'>
                    {data?.occupation && (
                        <>
                            <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Occupation</div>
                            <div className='w-3/5 leading-5 md:leading-7'>{data?.occupation}</div>
                        </>
                    )}
                    {data?.education && (
                        <>
                            <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Education</div>
                            <div className='w-3/5 leading-5 md:leading-7'>{data?.education}</div>
                        </>
                    )}
                </div>
            </div>

        </Container>
    );
}
