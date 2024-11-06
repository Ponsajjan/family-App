'use client'
import React, { useState } from 'react'
import { ButtonSolid } from '../../../components/Button'
import Input from '@/components/Input';
import RadioButton from "@/components/RadioButton"
import Checkbox from "@/components/CheckBox";

function Form() {

  return (
    <form className='text-text_color'>
        <Input className="mb-2" label="Name" placeholder="Name" />
        <div className='flex gap-2 pt-2 pb-4 '>
            <p className="text-sm font-medium">Gender:</p>
            <RadioButton label="Male" name="gender" value="Male" defaultChecked />
            <RadioButton label="Female" name="gender" value="Female" />
        </div>
        <div>
            <p className="text-sm font-medium">Date Of Birth <span className='font-normal opacity-45'>(Optional)</span></p>
            <div className="w-full mb-2 flex gap-2">
                <Input type="number" placeholder="DD" name="birth_date" label="" />
                <Input type="number" placeholder="MM" name="birth_month" label="" />
                <Input type="number" placeholder="YYYY" name="birth_year" label="" />
            </div>
        </div>
        <div className="flex items-center gap-2 py-2 flex-wrap relative">
            <p className="text-sm font-medium">Deceased</p>
            <input type="checkbox" className="peer bg-main_background border border-border_active rounded-md" name="deceased" />

            <div className="hidden peer-checked:block">
                <p className='text-xs font-extralight absolute top-3 left-28'>(Remove checkmark if not Deceased)</p>
                <p className="text-sm font-medium">Date Of Death <span className='font-normal opacity-45'>(Optional)</span></p>
                <div className="w-full mb-2 flex gap-2" >
                    <Input type="number" placeholder="DD" name="death_date" label="" />
                    <Input type="number" placeholder="MM" name="death_month" label="" />
                    <Input type="number" placeholder="YYYY" name="death_year" label="" />
                </div>
            </div>
        </div>
        <Input className="mb-2" type="number" placeholder="Phone Number" name="phone_number" label="Phone Number" />
        <Input className="mb-2" placeholder="Occupation" name="occupation" label="Occupation" />
        <Input className="mb-2" placeholder="Education" name="education" label="Education" />
        <Input className="mb-2" placeholder="Address" name="address" label="Address" />
        <div className="flex items-center gap-2 py-2 flex-wrap relative">
            <p className="text-sm font-medium">Lalavillai Family</p>
            <input type="checkbox" className="peer bg-main_background border border-border_active rounded-md" name="deceased" />

            <div className="hidden peer-checked:flex w-full gap-2 mb-2">
                <label className="w-full block" htmlFor="father">
                    <p className="text-sm">Father</p>
                    <input 
                        className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" 
                        placeholder='Phone Number' 
                        name='father' />
                </label>
                <label className="w-full block" htmlFor="mother">
                    <p className="text-sm">Mother</p>
                    <input 
                        className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" 
                        placeholder='Phone Number' 
                        name='mother' />
                </label>
            </div>
        </div>
        <label className="w-full block mb-2" htmlFor="education">
            <p className="text-sm">Partner</p>
            <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" placeholder='Phone Number' name='education' />
        </label>
        <label className="w-full block mb-8" htmlFor="education">
            <p className="text-sm">Children</p>
            <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" placeholder='Phone Number' name='education' />
        </label>
        {/* {error?.current_location && <div className="text-red-500">{error?.current_location}</div>} */}
        <ButtonSolid type="submit" className='w-full mb-4' buttonText="Add User" />
    </form>
  )
}

export default Form