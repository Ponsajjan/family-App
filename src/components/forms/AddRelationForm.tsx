import { ChangeMember, Info, MinusIcon, PlusIcon } from '@/utils/Icons'
import { useRef } from 'react'
import { ButtonSolid } from '../Button'
import { AddRelationFormValuesType } from '@/types/add__edit/add_relationship/types';

interface AddRelationShipFormPropType {
    selectedMemberData: any;
    selectedPartnerData: AddRelationFormValuesType;
    newChildrenData: AddRelationFormValuesType;
    showListFor: string;
    setNewChildrenData: (value: AddRelationFormValuesType) => void;
    setSelectedPartnerId: (value: number | null | undefined) => void;
    handleShowList: (value: 'selectMember' | 'selectPartner' | 'selectChildren') => void;
    handleSelectedValue: (name: string, id: number, select: string, verified: boolean) => void;
    handleSubmit: any;
    showList: boolean;
}

function AddRelationShipForm({
    selectedMemberData,
    selectedPartnerData,
    newChildrenData,
    showListFor,
    setNewChildrenData,
    setSelectedPartnerId,
    handleShowList,
    handleSelectedValue,
    handleSubmit,
    showList
}: AddRelationShipFormPropType) {

    const dragItem = useRef<number>(0);
    const dragOverItem = useRef<number>(0);

    const handleDragStart = (index: number) => {
        dragItem.current = index;
    };

    const handleDragEnter = (index: number) => {
        dragOverItem.current = index;
    };

    const handleDrop = () => {
        const list = newChildrenData.children;
        const dragItemContent = list[dragItem.current];
        list.splice(dragItem.current, 1);
        list.splice(dragOverItem.current, 0, dragItemContent);
        setNewChildrenData({ ...newChildrenData, children: list });
    };

  return (
    <form className="text-text_color relative" onSubmit={handleSubmit}>
        {!selectedMemberData?.name && <div onClick={() => handleShowList('selectMember')} className={`absolute inset-0 z-10`}></div>}
        <h3 className="text-sm">Member</h3>
        <div 
            onClick={() => handleShowList('selectMember')} 
            className={`w-full flex justify-between items-center ${(selectedMemberData?.name == undefined || (showListFor === 'selectMember' && showList)) ? 'outline-2 outline-dashed outline-offset-2 outline-border_active' : ''} px-2 border bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-[10px] cursor-pointer`} 
        >
            {selectedMemberData?.name ? 
            <>
                <span className="py-2 w-full">{selectedMemberData?.name}</span> 
                <span><ChangeMember /></span>
            </> :
            <span className='py-2 w-full text-gray-400'>Select Member</span>}
        </div>

        <div className="flex gap-1 items-center">
            <h3 className="text-sm">Partner</h3>
        </div>
        
        {(selectedMemberData?.partners != null && selectedMemberData?.partners.length > 0) ?   
            selectedMemberData?.partners.map((partner: {id:any, name:string}) => (
                <div className={`w-full flex justify-between items-center ${(showListFor === 'selectPartner' && showList) ? 'outline-2 outline-dashed outline-offset-2 outline-border_active' : ''} px-2 border bg-field_color border-border_color text-sm rounded-md mb-[10px]`} >
                    <span className="py-2 w-full cursor-not-allowed">{partner?.name}</span>
                </div>
            ))
            : (selectedPartnerData?.name) ? 
            <div onClick={() => handleShowList('selectPartner')} className={`w-full flex justify-between items-center ${(showListFor === 'selectPartner' && showList) ? 'outline-2 outline-dashed outline-offset-2 outline-border_active' : ''} px-2 border bg-field_color border-border_color text-sm rounded-md mb-[10px]`} >
                <span className="py-2 w-full">{selectedPartnerData?.name}</span>
                <span
                    onClick={() => {handleShowList('selectPartner'); setSelectedPartnerId(null)}}
                    className="border border-border_color cursor-pointer rounded-md h-fit">
                    <MinusIcon />
                </span>
            </div> : 
            <div className={`w-full flex justify-between items-center ${(showListFor === 'selectPartner' && showList) ? 'outline-2 outline-dashed outline-offset-2 outline-border_active' : ''} px-2 border bg-field_color border-border_color text-sm rounded-md mb-[10px]`} >
                <span onClick={() => handleShowList('selectPartner')} className='py-2 w-full text-gray-400 cursor-pointer'>Select Partner</span>
            </div>}
            
        {(selectedMemberData.children?.length > 0 || newChildrenData.children.length > 0 || selectedPartnerData?.children?.length > 0) &&
        <div>
            <h3 className="text-sm">Children</h3>
            <>
                {selectedMemberData.children?.map((item: {id:any, name:string}) => (
                <div key={item?.id} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-[10px] cursor-not-allowed" >
                    <span className="py-2 w-full">{item?.name}</span>
                </div>)
                )}
            </>
            <>
                {selectedPartnerData?.children.map((item: {id:any, name:string}) => (
                <div key={item?.id} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-[10px] cursor-not-allowed" >
                    <span className="py-2 w-full">{item?.name}</span>
                </div>)
                )}
            </>
            <>
                {newChildrenData?.children.map((item: {id:any, name:string, verified:boolean}, index) => (
                <div key={index} className={`w-full flex justify-between items-center px-2 border active:border-dashed bg-field_color border-border_color text-sm rounded-md mb-[10px] cursor-grab`} 
                    draggable={true}
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <span className="py-2 w-full">{item?.name}</span>
                    <span
                        onClick={() => {handleSelectedValue(item?.name, item?.id, 'selectChildren', item?.verified)}}
                        className="border border-border_color rounded-md h-fit cursor-pointer">
                        <MinusIcon />
                    </span>
                </div>)
                )}
            </>
        </div>}
        <div onClick={() => handleShowList('selectChildren')} className={`flex items-center bg-field_color cursor-pointer ${(showListFor === 'selectChildren' && showList) ? 'outline-2 outline-dashed outline-offset-2 outline-border_active' : ''} text-xs ml-0 mr-auto py-1 px-4 border border-border_color rounded-full w-fit mb-2`}>
            <span className="pr-2">Add Children</span>
            <span className="w-4 h-4"><PlusIcon /></span>
        </div>

        {
            (selectedMemberData.verified || 
            selectedPartnerData.verified || 
            newChildrenData.children.some((child:any) => child.verified)) &&
            <p className='mt-2'><span className='inline-block align-bottom pr-1'><Info /></span> This change involves verified member, so updates will require moderator approval before they take effect.</p>
        }
        <ButtonSolid type="submit" className="w-full mt-8 mb-4" buttonText="Add Relationship" />
    </form>
  )
}

export default AddRelationShipForm;