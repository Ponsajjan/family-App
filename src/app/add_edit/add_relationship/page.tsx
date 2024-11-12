'use client'

import React, { useState } from 'react'
import { ButtonSolid } from '../../../components/Button'
import prisma from "@/db/db";
import Container from "@/components/Container";
import Link from "next/link";
import { AddRelationship, BackButton, SvgArrow } from "@/utils/Icons";
import MemberList from "@/components/MemberList";

// Mark this as a server component
export const dynamic = 'force-dynamic'; // Optional, forces dynamic rendering
// Since app/ uses server-side rendering by default, we can make this an async function
export default function Relatives() {
  const [name, setName] = useState('')
  const [father, setFather] = useState('')
  const [mother, setMother] = useState('')
  const [partner, setPartner] = useState('')
  const [children, setChildren] = useState('')

  const [showListFor, setShowListFor] = useState('allMembers')
  const [showList, setShowList] = useState(false)
  return (
    <div className='md:flex text-text_color'>
      <Container className="p-4 md:pt-0 md:border-r md:border-border_color">
          <div className="w-full lg:max-w-xl mx-auto">
            <div className="flex justify-start items-center mb-4">
                <Link href={"/add_edit"} className="block"><AddRelationship /></Link>
                <p className="text-2xl font-semibold text-center text-text_color underline pl-3">Add Relationship</p>
            </div>
            <form className='text-text_color'>
              <p className="text-sm">Name</p>
              <div onClick={() => setShowList(true)} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer" 
              >{name ? name : 'Name'}</div>

              <div className="flex items-center gap-2 flex-wrap relative py-2">
                  <p className="text-sm font-medium">Lalavillai Family</p>
                  <input type="checkbox" className="peer bg-main_background border border-border_active rounded-md" name="deceased" />
                  <div className="hidden peer-checked:flex w-full gap-2">
                      <div className='w-full'>
                          <p className="text-sm">Father</p>
                          <div onClick={() => setShowListFor('forFather')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md cursor-pointer"
                          >{father ? father : 'Father'}
                          </div>
                      </div>
                      <div className='w-full'>
                          <p className="text-sm">Mother</p>
                          <div onClick={() => setShowListFor('forMother')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md cursor-pointer" 
                          >{mother ? mother : 'Mother'}</div>
                      </div>
                  </div>
              </div>

              <p className="text-sm">Partner</p>
              <div onClick={() => setShowListFor('forPartner')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer" 
              >{partner ? partner : 'Partner'}</div>
              <p className="text-sm">Children</p>
              <div onClick={() => setShowListFor('forChildren')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-8 cursor-pointer" 
              >{children ? children : 'Children'}</div>

              <ButtonSolid type="submit" buttonText="Add User" className='w-full mb-4' />
            </form>
          </div>
      </Container>
      <MemberList />
    </div>
  )
}



{/* <div className='md:flex text-text_color'>
<Container className="px-3 pt-4 md:pt-0 md:border-r md:border-border_color">
    <Form />
</Container>
{showDetails && (
<div onClick={() => setShowDetails(false)} className="fixed md:hidden inset-0 bg-gray-500 bg-opacity-75 transition-opacity cursor-not-allowed z-40" />
)}
<div className={`${ showDetails
    ? "block md:static fixed left-0 right-0 bottom-0 min-h-[60%] max-h-[90%] md:h-full z-40 rounded-t-md"
    : "hidden md:block" } w-full bg-main_background px-5 overflow-y-auto pb-4`} >
    <List users={users} />
</div>
</div> */}