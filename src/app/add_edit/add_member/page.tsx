"use client"

import Container from "@/components/Container";
import { ButtonSolid } from '@/components/Button'
import Input from "@/components/Input"
import RadioButton from "@/components/RadioButton"
import addUserAction from "./action"
import Link from "next/link";
import { AddMember } from "@/utils/Icons";

export default async function AddUser() {
    return (
        <div className='md:flex text-text_color'>
            <Container className="px-3 pt-4 md:pt-0 md:border-r md:border-border_color">
                <div className="w-full md:max-w-xl mx-auto">
                    <div className="flex justify-start items-center mb-4">
                        <Link href={"/add_edit"} className="block"><AddMember /></Link>
                        <p className="text-2xl font-semibold text-center text-text_color underline pl-3">Add Member</p>
                    </div>
                    <form className='text-text_color' action={addUserAction} >
                        <Input required className="mb-2" name="name" label="Name" placeholder="Name" />
                        <div className='flex gap-2 pt-2 pb-4 '>
                            <p className="text-sm font-medium">Gender:</p>
                            <RadioButton label="Male" name="gender" value="Male" defaultChecked />
                            <RadioButton label="Female" name="gender" value="Female" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Date Of Birth <span className='font-normal opacity-45'>(Optional)</span></p>
                            <div className="w-full mb-2 flex gap-2">
                                <Input type="number" placeholder="DD" name="birth_date" min="1" max="31" label="" />
                                <Input type="text" placeholder="MM" name="birth_month" min="1" max="12" label="" />
                                <Input type="number" placeholder="YYYY" name="birth_year" min="1975" max="2025" label="" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 py-2 flex-wrap relative">
                            <p className="text-sm font-medium">Deceased</p>
                            <input type="checkbox" className="peer bg-main_background border border-border_active rounded-md" name="deceased" />

                            <div className="hidden peer-checked:block">
                                <p className='text-xs font-extralight absolute top-3 left-28'>(Remove checkmark if not Deceased)</p>
                                <p className="text-sm font-medium">Date Of Death <span className='font-normal opacity-45'>(Optional)</span></p>
                                <div className="w-full mb-2 flex gap-2">
                                    <Input type="number" placeholder="DD" name="death_date" label="" />
                                    <Input type="number" placeholder="MM" name="death_month" label="" />
                                    <Input type="number" placeholder="YYYY" name="death_year" label="" />
                                </div>
                            </div>
                        </div>
                        <Input className="mb-2" type="number" placeholder="Phone Number" name="phone_number" label="Phone Number" />
                        <Input className="mb-2" placeholder="Occupation" name="occupation" label="Occupation" />
                        <Input className="mb-2" placeholder="Education" name="education" label="Education" />
                        <Input className="mb-8" placeholder="Address" name="address" label="Address" />

                        <ButtonSolid type="submit" className='w-full mb-4' buttonText="Add Member"/>
                    </form>
                </div>
            </Container>
            <div className="w-full lg:max-w-lg mx-auto">
                <div className="w-full md:flex">
                    <Container>
                        <div className='px-3 pb-3 bg-main_background text-text_color z-10'>
                            <p className="cursor-pointer px-3 py-2 border border-l-4 border-border_color bg-field_color rounded mb-2">January</p>
                            <p className="cursor-pointer px-3 py-2 border border-l-4 border-border_color bg-field_color rounded mb-2">Febuary</p>
                            <p className="cursor-pointer px-3 py-2 border border-l-4 border-border_color bg-field_color rounded mb-2">March</p>
                            <p className="cursor-pointer px-3 py-2 border border-l-4 border-border_color bg-field_color rounded mb-2">April</p>
                            <p className="cursor-pointer px-3 py-2 border border-l-4 border-border_color bg-field_color rounded mb-2">May</p>
                            <p className="cursor-pointer px-3 py-2 border border-l-4 border-border_color bg-field_color rounded mb-2">June</p>
                            <p className="cursor-pointer px-3 py-2 border border-l-4 border-border_color bg-field_color rounded mb-2">July</p>
                            <p className="cursor-pointer px-3 py-2 border border-l-4 border-border_color bg-field_color rounded mb-2">August</p>
                            <p className="cursor-pointer px-3 py-2 border border-l-4 border-border_color bg-field_color rounded mb-2">September</p>
                            <p className="cursor-pointer px-3 py-2 border border-l-4 border-border_color bg-field_color rounded mb-2">October</p>
                            <p className="cursor-pointer px-3 py-2 border border-l-4 border-border_color bg-field_color rounded mb-2">November</p>
                            <p className="cursor-pointer px-3 py-2 border border-l-4 border-border_color bg-field_color rounded mb-2">Descember</p>
                        </div>
                        <div className="flex flex-wrap gap-2 p-2 justify-center">
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">1</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">2</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">3</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">4</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">5</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">6</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">7</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">8</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">9</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">10</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">12</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">13</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">14</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">15</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">16</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">17</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">18</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">19</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">20</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">21</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">22</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">23</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">24</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">25</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">26</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">27</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">28</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">29</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">30</p>
                            <p className="p-4 border border-border_color text-center text-base w-full min-w-14 max-w-20 rounded-md">31</p>   
                        </div>
                    </Container>
                </div>
            </div>
        </div>
    )
}