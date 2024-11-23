'use client'

import React, { useState } from 'react'
import { ButtonSolid } from '../../../components/Button'
import prisma from "@/db/db";
import Container from "@/components/Container";
import Link from "next/link";
import { AddRelationship, BackButton, CloseIcon, SvgArrow } from "@/utils/Icons";
import MemberList from "@/components/MemberList";

// Mark this as a server component
export const dynamic = 'force-dynamic'; // Optional, forces dynamic rendering
// Since app/ uses server-side rendering by default, we can make this an async function
export default function Relatives() {
  const [formData, setFormData] = useState({
    name: "",
    father: "",
    mother: "",
    partner: [],
    children: [],
  });

  console.log('formData', formData)

  const [showListFor, setShowListFor] = useState('selectMember')
  const [showList, setShowList] = useState(false)

  const handleShowList = (value: any) => {
    setShowListFor(value)
    setShowList(true)
  }

  const handleCancelSelectedValue = (item: any, key:any) => {
    if (!key) return;
  
    setFormData((prev: any) => {
      if (Array.isArray(prev[key])) {
        // For array keys: Add or remove the value
        const updatedArray = prev[key].includes(item)
          ? prev[key].filter((val: any) => val !== item) // Remove if it exists
          : [...prev[key], item]; // Add if it doesn't exist
  
        return { ...prev, [key]: updatedArray };
      }
    });
  };

  return (
    <div className='md:flex text-text_color'>
      <Container>
        <div className="w-full md:max-w-xl p-4 mx-auto">
          <div className="flex justify-start items-center mb-4">
              <Link href={"/add_edit"} className="block"><AddRelationship /></Link>
              <p className="text-2xl font-semibold text-center text-text_color underline pl-3">Add Relationship</p>
          </div>
          <form className='text-text_color'>
            <p className="text-sm">Name</p>
            <div onClick={() => handleShowList('selectMember')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer" 
            >{formData.name ? formData.name : <span className='text-gray-400'>Name</span>}</div>

            <div className="flex items-center gap-2 flex-wrap relative py-2">
                <p className="text-sm font-medium">Lalavillai Family</p>
                <input type="checkbox" className="peer bg-main_background border border-border_active rounded-md" name="deceased" />
                <div className="hidden peer-checked:flex w-full gap-2">
                    <div className='w-full'>
                        <p className="text-sm">Father</p>
                        <div onClick={() => handleShowList('selectFather')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md cursor-pointer"
                        >{formData.father ? formData.father : <span className='text-gray-400'>Father</span>}
                        </div>
                    </div>
                    <div className='w-full'>
                        <p className="text-sm">Mother</p>
                        <div onClick={() => handleShowList('selectMother')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md cursor-pointer" 
                        >{formData.mother ? formData.mother : <span className='text-gray-400'>Mother</span>}</div>
                    </div>
                </div>
            </div>

            <p className="text-sm">Partner</p>
            <div>
              {formData.partner.length <= 0 ? (
                <div onClick={() => handleShowList('selectPartner')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer" >
                  <span className='text-gray-400'>Partner</span>
                </div>) :
                formData.partner.map((selected:any, index:number) => (
                  <div key={index} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer" >
                    <span onClick={() => handleShowList('selectPartner')} className="py-2 w-full">{selected}</span>
                    {(formData.partner.length > 1) && 
                      <span
                        onClick={() => handleCancelSelectedValue(selected, 'partner')}
                        className="border border-border_color rounded-md h-fit">
                        <CloseIcon />
                      </span>
                    }
                  </div>)
                )
              }
            </div>
            <p className="text-sm">Children</p>
            <div className='mb-8' >
              {formData.children.length <= 0 ? (
                <div onClick={() => handleShowList('selectChildren')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer" >
                  <span className='text-gray-400'>Children</span>
                </div>) :
                formData.children.map((selected:any, index:number) => (
                  <div key={index} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer" >
                    <span onClick={() => handleShowList('selectChildren')} className="py-2 w-full">{selected}</span>
                    {(formData.children.length > 1) && 
                      <span
                        onClick={() => handleCancelSelectedValue(selected, 'children')}
                        className="border border-border_color rounded-md h-fit">
                        <CloseIcon />
                      </span>
                    }
                  </div>)
                )
              }
            </div>
            <ButtonSolid type="submit" buttonText="Add Relationship" className='w-full mb-4' />
          </form>
        </div>
      </Container>
      {showList && (
      <div
        onClick={() => setShowList(false)}
        className="fixed md:hidden inset-0 bg-gray-500 bg-opacity-75 z-[100]"
      /> )}
      <div className={`${showList ? 'md:border-l md:border-border_color md:static fixed left-0 right-0 bottom-0 z-[100] rounded-t-md' : 'md:w-0 h-0 opacity-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full lg:max-w-lg mx-auto bg-main_background overflow-y-auto`}>
        <MemberList forType={showListFor} getSelectedValues={formData} setSelectedValue={setFormData} openList={setShowList}/>
      </div>
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