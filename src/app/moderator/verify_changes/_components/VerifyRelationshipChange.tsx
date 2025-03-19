import { ButtonOutline, ButtonSolid } from '@/components/Button';
import Container from '@/components/Container';
import HoldButton from '@/components/HoldButton';
import { CloseIcon, Condolences, Female2, Male2, Verified } from '@/utils/Icons';
import { format } from 'date-fns';
import React from 'react';

export default function VerifyMemberRelation({ data, openDetails }: any) {

    return (
        <Container className='text-text_color py-6 px-4 relative bg-main_background scroll-stable'>
            <div onClick={() => openDetails(false)} className='hidden md:block absolute top-0 right-0 border border-border_color rounded-md m-2 cursor-pointer'><CloseIcon /></div>
            <div className='flex gap-2 items-center w-full pb-6'>
                <div className='border border-border_color p-2 rounded-md relative'>
                    <Male2 />
                    <span className='absolute -bottom-2 -right-2'><Condolences /></span>
                </div>
                <p className='text-lg font-semibold flex items-center'>
                    <span>Name Unavailable</span>
                    <span className='pl-2'><Verified /></span>
                </p>
            </div>
            <div className="text-text_color">
                <div className="flex gap-2">
                    <p className="whitespace-nowrap text-nowrap font-semibold">Partner:</p>
                    <div className='flex flex-wrap'>
                        <p>hello</p>
                    </div>
                </div>
                <span className='border-b border-dashed border-border_color block w-full my-1'/>
                <div className="flex gap-1">
                    <p className="whitespace-nowrap text-nowrap font-semibold">Children:</p>
                    <div className='flex gap-1'>
                        <p className='line-through opacity-55'>Ramu,</p>
                        <p>Somu,</p>
                    </div>
                    <div className='flex flex-wrap'>
                        <p>Komu,</p>
                    </div>
                    <div className='flex flex-wrap'>
                        <p>chomu*</p>
                    </div>
                </div>
            </div>
            <div className='flex flex-col mt-4 gap-2'>
                <HoldButton buttonText='Approve changes' onClick={() => console.log("hi")}/>
                <HoldButton type='outline' buttonText='Reject changes' onClick={() => console.log("hi")} />
            </div>
        </Container>
    );
}
