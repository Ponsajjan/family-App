'use client'

import React, { useState } from 'react'
import { ButtonSolid } from '../../../components/Button'

function Form() {

    return (
        <form className='text-text_color'>
            <label className="w-full block mb-3" htmlFor="name">
                <p className="text-sm">Name</p>
                <input 
                    className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" 
                    placeholder='Name' 
                    name='name' 
                />
            </label>

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

            <label className="w-full block mb-2" htmlFor="partner">
                <p className="text-sm">Partner</p>
                <input 
                    className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" 
                    placeholder='Phone Number' 
                    name='partner' 
                />
            </label>

            <label className="w-full block mb-8" htmlFor="children">
                <p className="text-sm">Children</p>
                <input 
                    className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md" 
                    placeholder='Phone Number' 
                    name='children' 
                />
            </label>

            <ButtonSolid type="submit" buttonText="Add User" className='w-full mb-4' />
        </form>
    )
}

export default Form;
