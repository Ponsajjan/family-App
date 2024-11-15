"use client"

import { ButtonSolid } from '@/components/Button'
import Input from "@/components/Input"
import RadioButton from "@/components/RadioButton"
import addUserAction from "./action"
import Link from "next/link";
import { AddMember } from "@/utils/Icons";

export default async function AddUser() {
    return (
        <div className="w-full md:max-w-xl p-4 mx-auto">
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
                        <Input type="number" placeholder="DD" name="birth_date" min="1" max="31" maxLength="2" label="" />
                        <Input type="number" placeholder="MM" name="birth_month" min="1" max="12" maxLength="2" label="" />
                        <Input type="number" placeholder="YYYY(Opt)" name="birth_year" min="1975" max={new Date().getFullYear()} maxLength="4" label="" />
                    </div>
                </div>
                <div className='relative py-2'>
                    <p className="text-sm font-medium pr-2 inline-block">Deceased</p>
                    <input type="checkbox" className="peer align-middle inline-block bg-main_background border border-border_active rounded-md" name="deceased" />

                    <div className="hidden peer-checked:block pt-2">
                        <p className="text-sm font-medium">Date Of Death <span className='font-normal opacity-45'>(Optional)</span></p>
                        <p className='text-xs font-extralight absolute top-3 left-24'>(Remove checkmark if not Deceased)</p>
                        <div className="w-full flex gap-2">
                            <Input type="number" placeholder="DD(Opt)" name="death_date" min="1" max="31" maxLength="2" label="" />
                            <Input type="number" placeholder="MM" name="death_month" min="1" max="12" maxLength="2" label="" />
                            <Input type="number" placeholder="YYYY" name="death_year" min="1975" max={new Date().getFullYear()} maxLength="4" label="" />
                        </div>
                    </div>
                </div>
                <Input className="mb-2" type="number" placeholder="Phone Number (Optional)" name="phone_number" label="Phone Number" />
                <Input className="mb-2" placeholder="Occupation (Optional)" name="occupation" label="Occupation" />
                <Input className="mb-2" placeholder="Education (Optional)" name="education" label="Education" />
                <Input className="mb-8" placeholder="Address (Optional)" name="address" label="Address" />

                <ButtonSolid type="submit" className='w-full mb-4' buttonText="Add Member"/>
            </form>
        </div>
    )
}