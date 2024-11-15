'use client'

import Container from "@/components/Container";
import { ButtonSolid } from "../../../components/Button";
import Link from "next/link";
import { EditMember } from "@/utils/Icons";
import React, { useState } from 'react'
import Input from '@/components/Input';
import RadioButton from "@/components/RadioButton"
import Checkbox from "@/components/CheckBox";
import MemberList from "@/components/MemberList";

// export const dynamic = 'force-dynamic';

export default function Relatives() {
  const [father, setFather] = useState('')
  const [mother, setMother] = useState('')
  const [partner, setPartner] = useState('')
  const [children, setChildren] = useState('')
  const [showListFor, setShowListFor] = useState('selectUser')
  const [showList, setShowList] = useState(false)

  const handleShowList = (value: any) => {
    setShowListFor(value)
    setShowList(true)
  }

  return (
    <div className='md:flex text-text_color'>
        <Container className="md:border-r md:border-border_color">
            <div className="w-full md:max-w-xl p-4 mx-auto">
              <div className="flex justify-start items-center mb-4">
                  <Link href={"/add_edit"} className="block"><EditMember /></Link>
                  <p className="text-2xl font-semibold text-center text-text_color underline pl-3">Edit Member</p>
              </div>
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
                <div className="flex items-center gap-2 flex-wrap relative py-2">
                    <p className="text-sm font-medium">Lalavillai Family</p>
                    <input type="checkbox" className="peer bg-main_background border border-border_active rounded-md" name="deceased" />
                    <div className="hidden peer-checked:flex w-full gap-2">
                        <div className='w-full'>
                            <p className="text-sm">Father</p>
                            <div onClick={() => handleShowList('selectFather')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md cursor-pointer"
                            >{father ? father : 'Father'}
                            </div>
                        </div>
                        <div className='w-full'>
                            <p className="text-sm">Mother</p>
                            <div onClick={() => handleShowList('selectMother')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md cursor-pointer" 
                            >{mother ? mother : 'Mother'}</div>
                        </div>
                    </div>
                </div>

                <p className="text-sm">Partner</p>
                <div onClick={() => handleShowList('selectPartner')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer" 
                >{partner ? partner : 'Partner'}</div>
                <p className="text-sm">Children</p>
                <div onClick={() => handleShowList('selectChildren')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-8 cursor-pointer" 
                >{children ? children : 'Children'}</div>
                <ButtonSolid type="submit" className='w-full mb-4' buttonText="Add User" />
              </form>
            </div>
        </Container>
        {showList && (
        <div onClick={() => setShowList(false)} className="fixed md:hidden inset-0 bg-gray-500 bg-opacity-75 transition-opacity cursor-not-allowed z-[100]" />
        )}
        {showList && (
        <div className="block md:static fixed left-0 right-0 bottom-0 z-[100] rounded-t-md w-full lg:max-w-lg mx-auto bg-main_background overflow-y-auto" >
          <MemberList forType={showListFor}/>
        </div>)}
    </div>
  )
}