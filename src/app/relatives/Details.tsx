import Container from '@/components/Container';
import { Birthday2, Deathday2, Female2 } from '@/utils/Icons';
import React from 'react'

export default function Details() {

    return (
        <Container className='text-text_color py-6'>
            <div className='flex gap-2 items-center w-full pb-3'>
                <div className='border border-border_color px-1 py-2 rounded-md'><Female2 /></div>
                <div className='flex justify-between items-center w-full'>
                    <div>
                        <p className='text-lg font-semibold'>Hello</p>
                        <div className='flex items-baseline gap-1 leading-5 text-sm'>
                            <p>Born At :</p>
                            <p>20 August 1995</p>
                            <Birthday2 />
                        </div>
                        <div className='flex items-baseline gap-1 leading-5 text-sm'>
                            <p>Died At :</p>
                            <p>15 November 2020</p>
                            <Deathday2 />
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex pt-3 items-center'>
                <p className='font-semibold whitespace-nowrap pr-4'>Relation Information</p>
                <p className='border-t border-border_color w-full'></p>
            </div>
            <div className='pl-1'> 
                <div className='flex flex-wrap border-l border-border_color pl-2'>
                    <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Father</div>
                    <div className='w-3/5 leading-5 md:leading-7'> hello</div>

                    <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Mother</div>
                    <div className='w-3/5 leading-5 md:leading-7'> hello</div>

                    <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Siblings</div>
                    <div className='w-3/5 leading-5 md:leading-7'>Hello, World, Hello, World, Hello, World, Hello, World</div>

                    <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Partner</div>
                    <div className='w-3/5 leading-5 md:leading-7'> hello</div>

                    <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Children</div>
                    <div className='w-3/5 leading-5 md:leading-7'>Hello, World</div>
                </div>
            </div>

            <div className='flex pt-3 items-center'>
                <p className='font-semibold whitespace-nowrap pr-4'>Contct Information</p>
                <p className='border-t border-border_color w-full'></p>
            </div>
            <div className='pl-1'> 
                <div className='flex flex-wrap pb-1 border-l border-border_color pl-2'>
                    <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Phone no.</div>
                    <div className='w-3/5 leading-5 md:leading-7'>98765421</div>

                    <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Address</div>
                    <div className='w-3/5 leading-5 md:leading-7'> 20/3 1A4 lala vallai Edalakudy post kanyakumari</div>
                </div>
            </div>

            <div className='flex pt-3 items-center'>
                <p className='font-semibold whitespace-nowrap pr-4'>Personal Information</p>
                <p className='border-t border-border_color w-full'></p>
            </div>
            <div className='pl-1'> 
                <div className='flex flex-wrap pb-1 border-l border-border_color pl-2'>
                    <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Occupation</div>
                    <div className='w-3/5 leading-5 md:leading-7'> hello</div>

                    <div className='w-2/5 leading-5 md:leading-7 font-medium capitalize'>Education</div>
                    <div className='w-3/5 leading-5 md:leading-7'> hello</div>
                </div>
            </div>
        </Container>
    )
}