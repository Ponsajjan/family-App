"use client"

import { Female, Male, SearchIcon } from '@/utils/Icons';
import React from 'react'
import Container from "@/components/Container";
import Checkbox from '@/components/CheckBox';
import Input from '@/components/Input';

export default function List({users} : any) {

    return (
        <div>
            <div className="w-full md:flex">
                {/* Left panel: User List */}
                <Container className="md:border-r md:border-border_color">
                    <div className='p-3 border-b border-border_color sticky top-0 bg-main_background z-10'>
                        <div className="relative w-full">
                            <Input
                                placeholder="Search.."
                                className="pl-9"
                            />
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                <SearchIcon />
                            </span>
                        </div>
                    </div>
                    <div className="flex text-text_color items-center px-3 bg-main_background sticky top-12 md:top-[59px] z-10">
                        <span className="font-semibold pr-1 whitespace-nowrap">A</span>
                        <span className="border-t border-border_color block w-full"></span>
                    </div>
                    {/* Render list of users */}
                    {users?.map((user:any) => (
                    <div key={user.id} className="pl-4">
                        <div className="border-l border-border_color pt-1 pb-2 pl-4 pr-3">
                            <div className="cursor-pointer px-3 py-2 flex items-center border border-border_color bg-field_color rounded text-text_color">
                                <div className='pr-3 border-r border-border_color'>
                                <Checkbox name="selected"/>
                                </div>
                                <div className='pl-4'>
                                    <div className="flex flex-wrap gap-2">
                                        {user.name === "hay" ? <Male /> : <Female /> }
                                        <div className='font-semibold capitalize'>{user.name}</div>
                                    </div>
                                    <div className='flex text-xs leading-3 opacity-65'>
                                        <div className='font-medium pr-1'>Parents:</div>
                                        <div>Hello, World</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>))}


                    {/* Render list again for "B", remove or adjust if this is not intended */}
                    <div className="flex text-text_color items-center px-3 bg-main_background sticky top-12 md:top-[59px] z-10">
                        <span className="font-semibold pr-1 whitespace-nowrap">B</span>
                        <span className="border-t border-border_color block w-full"></span>
                    </div>
                    {/* Render list of users */}
                    {users?.map((user:any) => (
                    <div key={user.id} className="pl-4">
                        <div className="border-l border-border_color py-1 pl-4 pr-3">
                            <div className="cursor-pointer px-3 py-2 flex items-center border border-border_color bg-field_color rounded text-text_color">
                                <div className='pr-3 border-r border-border_color'>
                                <input 
                                    type="checkbox"
                                    className="bg-main_background border border-border_active rounded-md" 
                                />
                                </div>
                                <div className='pl-4'>
                                    <div className="flex flex-wrap gap-2">
                                        {user.name === "hay" ? <Male /> : <Female /> }
                                        <div className='font-semibold capitalize'>{user.name}</div>
                                    </div>
                                    <div className='flex text-xs leading-3 opacity-65'>
                                        <div className='font-medium pr-1'>Parents:</div>
                                        <div>hello, world</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>))}

                    {/* Render list again for "C", remove or adjust if this is not intended */}
                    <div className="flex text-text_color items-center px-3 bg-main_background sticky top-12 md:top-[59px] z-10">
                        <span className="font-semibold pr-1 whitespace-nowrap">C</span>
                        <span className="border-t border-border_color block w-full"></span>
                    </div>
                    {/* Render list of users */}
                    {users?.map((user:any) => (
                    <div key={user.id} className="pl-4">
                        <div className="border-l border-border_color py-1 pl-4 pr-3">
                            <div className="cursor-pointer px-3 py-2 flex items-center border border-border_color bg-field_color rounded text-text_color">
                                <div className='pr-3 border-r border-border_color'>
                                <input 
                                    type="checkbox"
                                    className="bg-main_background border border-border_active rounded-md" 
                                />
                                </div>
                                <div className='pl-4'>
                                    <div className="flex flex-wrap gap-2">
                                        {user.name === "hay" ? <Male /> : <Female /> }
                                        <div className='font-semibold capitalize'>{user.name}</div>
                                    </div>
                                    <div className='flex text-xs leading-3 opacity-65'>
                                        <div className='font-medium pr-1'>Parents:</div>
                                        <div>hello, world</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>))}
                </Container>
            </div>
        </div>
    )
}
