'use client'
import React, { useState } from 'react'
import { ButtonSolid } from '../../../components/Button'
import Input from '@/components/Input';
import RadioButton from "@/components/RadioButton"
import Checkbox from "@/components/CheckBox";

function Form() {

  return (
    <form className='text-text_color'>
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
        <Input className="mb-2" placeholder="Address (Optional)" name="address" label="Address" />
        <div className="flex items-center gap-2 py-2 flex-wrap relative">
            <p className="text-sm font-medium">Lalavillai Family</p>
            <input type="checkbox" className="peer bg-main_background border border-border_active rounded-md" name="deceased" />

            <div className="hidden peer-checked:flex w-full gap-2">
                <Input type="text" placeholder="Father" name="father" label="Father" />
                <Input type="text" placeholder="Mother" name="mother" label="Mother" />
            </div>
        </div>
        <Input className="mb-2" type="text" placeholder="Partner" name="partner" label="Partner" />
        <Input className="mb-8" type="text" placeholder="Children" name="children" label="Children" />
        {/* {error?.current_location && <div className="text-red-500">{error?.current_location}</div>} */}
        <ButtonSolid type="submit" className='w-full mb-4' buttonText="Add User" />
    </form>
  )
}

export default Form