'use client'

import React, { useState } from 'react'
import { ButtonSolid } from '../../../components/Button'

function Form() {
    const [name, setName] = useState('')
    const [father, setFather] = useState('')
    const [mother, setMother] = useState('')
    const [partner, setPartner] = useState('')
    const [children, setChildren] = useState('')

    const [showListFor, setShowListFor] = useState('allMembers')

    return (
        <form className='text-text_color'>
            <p className="text-sm">Name</p>
            <div onClick={() => setShowListFor('allMembers')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer" 
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
    )
}

export default Form;
