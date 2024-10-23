'use client'
import React, { useState } from 'react'
import { ButtonSolid } from '../_components/Button'

function Form() {
    const[isFamily, setIsFamily] = useState(false)

    const handleIsFamily = (event:any) => {
        setIsFamily(event.target.checked);
    };
  return (
    <form className='text-text_color'>
        <label className="w-full block mb-2" htmlFor="name">
            <p className="text-sm">Name</p>
            <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" placeholder='Name' name='name' />
        </label>
        <div className='flex gap-2 pt-2 pb-4 '>
            <p className="text-sm font-medium">Gender:</p>
            <input type='radio' className='border border-border_active' />
            <p className="text-sm">Male</p>
            <input type='radio' className='border border-border_active' />
            <p className="text-sm">Female</p>
        </div>
        <div>
            <p className="text-sm">Date Of Birth</p>
            <label className="w-full mb-2 flex gap-2" htmlFor="dateOfBith">
                <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md max-w-[30%]" placeholder='DD' name='birthday' type="number"/>
                <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md max-w-[30%]" placeholder='Month' name='birthday' type="number"/>
                <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md max-w-[40%]" placeholder='YYYY' name='birthday' type="number"/>
            </label>
        </div>
        <div className="flex gap-2 mb-2">
            <p className="text-sm">Deceased</p>
            <input type="checkbox" className="bg-main_background border border-border_active rounded-md" />
        </div>
        <div>
            <p className="text-sm">Date Of Death</p>
            <label className="w-full mb-2 flex gap-2" htmlFor="dateOfBith">
                <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md max-w-[30%]" placeholder='DD' name='birthday' type="number"/>
                <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md max-w-[30%]" placeholder='Month' name='birthday' type="number"/>
                <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md max-w-[40%]" placeholder='YYYY' name='birthday' type="number"/>
            </label>
        </div>
        {/* {error?.birthday && <div className="text-red-500">{error?.birthday}</div>} */}
        <label className="w-full block mb-2" htmlFor="phoneNumber">
            <p className="text-sm">Phone Number</p>
            <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" placeholder='Phone Number' name='phone' />
        </label>
        <label className="w-full block mb-2" htmlFor="occupation">
            <p className="text-sm">Occupation</p>
            <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" placeholder='Phone Number' name='occupation' />
        </label>
        <label className="w-full block mb-2" htmlFor="education">
            <p className="text-sm">Education</p>
            <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" placeholder='Phone Number' name='education' />
        </label>
        {/* {error?.contact_number && <div className="text-red-500">{error?.contact_number}</div>} */}
        <label className="w-full block mb-2" htmlFor="address">
            <p className="text-sm">Address</p>
            <textarea className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" placeholder='Addess' name='address' />
        </label>
        <div className="flex gap-2 mb-2">
            <p className="text-sm">Lalavillai Family</p>
            <input type="checkbox" onClick={handleIsFamily} className="bg-main_background border border-border_active rounded-md" />
        </div>
        {isFamily && <div className="flex gap-2">
            <label className="w-full block mb-2" htmlFor="education">
                <p className="text-sm">Father</p>
                <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" placeholder='Phone Number' name='education' />
            </label>
            <label className="w-full block mb-2" htmlFor="education">
                <p className="text-sm">Mother</p>
                <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" placeholder='Phone Number' name='education' />
            </label>
        </div>}
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