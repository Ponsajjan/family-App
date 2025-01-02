import React from 'react'
import { ButtonSolid } from '../Button'
import { ChangeMember, CloseIcon, Divorced } from '@/utils/Icons'

function EditRelationShipForm({
    handleShowList,
    handleRemovePartnerValue,
    handleDivorcePartner,
    handleRemoveChildrenValue,
    handleSubmit,
    formData
}: any) {
  return (
    <form className="text-text_color relative" onSubmit={handleSubmit}>
        {!formData.name && <div onClick={() => handleShowList()} className={`absolute inset-0 z-10`}></div>}
        <p className="text-sm">Member</p>
        <div 
            onClick={() => handleShowList()} 
            className={`w-full flex justify-between ${!formData.name || formData.name == 'undefined' ? 'outline-2 outline-dashed outline-offset-2 outline-border_active' : ''} items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2 cursor-pointer`} 
        >
        {formData.name && formData.name !== 'undefined' ? 
            <>
                <span className="py-2 w-full">{formData.name}</span> 
                <span><ChangeMember /></span>
            </> :
            <span className='py-2 w-full text-gray-400'>Select Member</span>}
        </div>
        {!formData.name || formData.name === 'undefined' ? 
        <>
            <p className="text-sm">Partner</p>
            <div className="w-full px-2 border bg-field_color border-border_color text-sm rounded-md mb-2 cursor-pointer" >
                <span className='block py-2 w-full text-gray-400'>Select Partner</span> 
            </div>
        </> :
        formData.partner && formData.partner?.name !== 'undefined' ? 
        <>
            <p className="text-sm">Partner</p>
            <div className="w-full flex justify-between items-center pl-2 pr-[3px] border bg-field_color border-border_color text-sm rounded-md mb-2" >
                <span className="py-2 w-full">{formData.partner?.name}</span>
                <div className="flex gap-2 items-center border border-border_color px-2 py-0.5 rounded-md">
                    <span 
                        onClick={() => handleDivorcePartner()}
                        className="block border-r border-border_color w-9 h-6 pr-3 cursor-pointer">
                        <Divorced />
                    </span>
                    <span
                        onClick={() => handleRemovePartnerValue()}
                        className="block h-fit cursor-pointer">
                        <CloseIcon />
                    </span>
                </div>
            </div>
        </>: 
        <></>
        }
        {formData.children.length > 0 && 
        <>
            <p className="text-sm">Children</p>
            {formData.children?.map((item: {id:any, name:string}, index:number) => (
                <div key={index} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2" >
                <span className="py-2 w-full">{item?.name}</span>
                {formData.children.length > 0 && <span
                    onClick={() => handleRemoveChildrenValue(item?.name, item?.id)}
                    className="border border-border_color rounded-md h-fit  cursor-pointer">
                    <CloseIcon />
                </span>}
                </div>)
            )}
        </>}
        <ButtonSolid type="submit" className="w-full mt-8 mb-4" buttonText="Update Details" />
    </form>
  )
}

export default EditRelationShipForm