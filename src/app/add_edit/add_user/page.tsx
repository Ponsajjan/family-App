'use client'
import Container from "@/components/Container";
import { useState } from "react";
import { ButtonSolid } from '../_components/Button'

export default function AddUser() {
  const [showDetails, setShowDetails] = useState(false);
  const[deceased, setDeceased] = useState(false);

  const handlDeceased = (event:any) => {
      setDeceased(event.target.checked);
  };
  return (
      <Container className="px-3 pt-4 w-full md:w-3/4 mx-auto">
          <div className="w-full md:max-w-xl mx-auto">
            <form className='text-text_color'>
              <label className="w-full block mb-2" htmlFor="name">
                  <p className="text-sm font-medium">Name</p>
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
                  <p className="text-sm font-medium">Date Of Birth <span className='font-normal opacity-45'>(Optional)</span></p>
                  <label className="w-full mb-2 flex gap-2" htmlFor="dateOfBith">
                      <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md max-w-[30%]" placeholder='DD' name='birthday' type="number"/>
                      <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md max-w-[30%]" placeholder='MM' name='birthday' type="number"/>                      <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md max-w-[40%]" placeholder='YYYY' name='birthday' type="number"/>
                  </label>
              </div>
              <div className="flex items-center gap-2 py-2 flex-wrap">
                  <p className="text-sm font-medium">Deceased</p>
                  <input type="checkbox" checked={deceased} onClick={handlDeceased} className="bg-main_background border border-border_active rounded-md" />
                  {deceased && <p className='text-xs font-extralight'>Remove checkmark if not Deceased</p>}
              </div>
              {deceased && <div>
                  <p className="text-sm font-medium">Date Of Death <span className='font-normal opacity-45'>(Optional)</span></p>
                  <label className="w-full mb-2 flex gap-2" htmlFor="dateOfBith">
                      <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md max-w-[30%]" placeholder='DD' name='birthday' type="number"/>
                      <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md max-w-[30%]" placeholder='MM' name='birthday' type="number"/>
                      <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md max-w-[40%]" placeholder='YYYY' name='birthday' type="number"/>
                  </label>
              </div>}
              <label className="w-full block mb-2" htmlFor="phoneNumber">
                  <p className="text-sm font-medium">Phone Number <span className='font-normal opacity-45'>(Optional)</span></p>
                  <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" placeholder='Phone Number' name='phone' />
              </label>
              <label className="w-full block mb-2" htmlFor="occupation">
                  <p className="text-sm font-medium">Occupation <span className='font-normal opacity-45'>(Optional)</span></p>
                  <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" placeholder='Phone Number' name='occupation' />
              </label>
              <label className="w-full block mb-2" htmlFor="education">
                  <p className="text-sm font-medium">Education <span className='font-normal opacity-45'>(Optional)</span></p>
                  <input className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" placeholder='Phone Number' name='education' />
              </label>
              <label className="w-full block mb-8" htmlFor="address">
                  <p className="text-sm font-medium">Address <span className='font-normal opacity-45'>(Optional)</span></p>
                  <textarea className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" placeholder='Addess' name='address' />
              </label>
              <ButtonSolid type="submit" className='w-full mb-4' buttonText="Add User"/>
            </form>
          </div>
      </Container>
  )
}