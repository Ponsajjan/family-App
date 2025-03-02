import React, { useRef } from 'react'
import { ButtonSolid } from '../Button'
import { ChangeMember, CloseIcon, Divorced } from '@/utils/Icons'

function EditRelationShipForm({
    handleShowList,
    handleDivorcePartner,
    handleRemoveChildrenValue,
    handleSubmit,
    formData,
    setFormData,
    setNoChanges
}: any) {

    const dragItem = useRef<number>(0);
    const dragOverItem = useRef<number>(0);

    const handleDragStart = (index: number) => {
        dragItem.current = index;
    };

    const handleDragEnter = (index: number) => {
        dragOverItem.current = index;
    };

    const handleDrop = () => {
        const list = formData.children;
        const dragItemContent = list[dragItem.current];
        list.splice(dragItem.current, 1);
        list.splice(dragOverItem.current, 0, dragItemContent);
        setFormData({ ...formData, children: list });
        setNoChanges(false);
    };

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
                <div className="flex gap-2 items-center border border-border_color px-1 py-0.5 rounded-md">
                    <span 
                        onClick={() => handleDivorcePartner()}
                        className="block w-9 h-6 cursor-pointer">
                        <Divorced />
                    </span>
                    {/* <span
                        onClick={() => handleRemovePartnerValue()}
                        className="block h-fit cursor-pointer">
                        <CloseIcon />
                    </span> */}
                </div>
            </div>
        </>: 
        <></>
        }
        {formData.children.length > 0 && 
        <>
            <p className="text-sm">Children</p>
            {formData.children?.map((item: {id:any, name:string}, index:number) => (
                <div key={item.id} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2 cursor-grab" 
                    draggable={true}
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                <span className="py-2 w-full">{item?.name}</span>
                {formData.children.length > 0 && <span
                    onClick={() => handleRemoveChildrenValue(item?.name, item?.id)}
                    className="border border-border_color rounded-md h-fit  cursor-pointer">
                    <CloseIcon />
                </span>}
                </div>)
            )}
        </>}
        <p>One of the members is already verified, and their data is locked. Any changes will require moderator approval.</p>
        <ButtonSolid type="submit" className="w-full mt-8 mb-4" buttonText="Update Details" />
    </form>
  )
}

export default EditRelationShipForm