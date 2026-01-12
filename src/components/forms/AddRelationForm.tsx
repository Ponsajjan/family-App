import { ChangeMember, Info, MinusIcon, PlusIcon } from '@/utils/Icons'
import { useRef, useState } from 'react'
import { ButtonSolid } from '../Button'
import { AddRelationFormValuesType } from '@/types/add__edit/add_relationship/types';

interface AddRelationShipFormPropType {
    selectedMemberData: AddRelationFormValuesType;
    selectedPartnerData: AddRelationFormValuesType;
    newChildrenData: AddRelationFormValuesType;
    showListFor: string;
    setNewChildrenData: (value: AddRelationFormValuesType) => void;
    setSelectedPartnerId: (value: number | null | undefined) => void;
    handleShowList: (value: 'selectMember' | 'selectPartner' | 'selectChildren') => void;
    handleSelectedValue: (name: string, id: number, select: string, verified: boolean) => void;
    handleSubmit: any;
    showList: boolean;
    submitting?: boolean;
    submitError: string | null;
    error: string | null;
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
    showList,
    submitting = false,
    error,
    submitError
}: AddRelationShipFormPropType) {

    const dragItem = useRef<number>(0);
    const dragOverItem = useRef<number>(0);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const touchStartPos = useRef<{ x: number; y: number } | null>(null);
    const dragThreshold = 10; // pixels to move before considering it a drag

    const handleDragStart = (index: number) => {
        dragItem.current = index;
        setIsDragging(true);
    };

    const handleDragEnter = (index: number) => {
        dragOverItem.current = index;
        setDraggedOverIndex(index);
    };

    const handleDrop = () => {
        // Create a copy of the array to avoid mutating the original
        const list = [...newChildrenData.children];
        const dragItemContent = list[dragItem.current];
        list.splice(dragItem.current, 1);
        list.splice(dragOverItem.current, 0, dragItemContent);
        setNewChildrenData({ ...newChildrenData, children: list });
        setIsDragging(false);
        setDraggedOverIndex(null);
    };

    const handleTouchStart = (index: number, e: React.TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        touchStartPos.current = { x: touch.clientX, y: touch.clientY };
        dragItem.current = index;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchStartPos.current) return;

        const touch = e.touches[0];
        const { clientX, clientY } = touch;

        // Check if we've moved beyond the threshold
        if (!isDragging) {
            const deltaX = Math.abs(clientX - touchStartPos.current.x);
            const deltaY = Math.abs(clientY - touchStartPos.current.y);

            if (deltaX > dragThreshold || deltaY > dragThreshold) {
                // User has moved enough, start dragging
                setIsDragging(true);
            } else {
                // Not enough movement yet, don't start dragging
                return;
            }
        }

        e.preventDefault();

        const overIndex = itemRefs.current.findIndex((ref) => {
            if (!ref) return false;
            const rect = ref.getBoundingClientRect();
            return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
        });
        if (overIndex !== -1) {
            dragOverItem.current = overIndex;
            setDraggedOverIndex(overIndex);
        } else {
            setDraggedOverIndex(null);
        }
    };

    const handleTouchEnd = () => {
        if (isDragging) {
            handleDrop();
        }
        // Reset touch tracking
        touchStartPos.current = null;
        setIsDragging(false);
        setDraggedOverIndex(null);
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
                {error && <p className="text-sm text-blue-500">{error}</p>}
            </div>
            <div className={`w-full flex justify-between items-center ${(showListFor === 'selectPartner' && showList) ? 'outline-2 outline-dashed outline-offset-2 outline-border_active' : ''} px-2 border bg-field_color border-border_color text-sm rounded-md mb-[10px]`} >
                {(selectedMemberData?.partner?.name)
                    ? <span className="py-2 w-full cursor-not-allowed">{selectedMemberData.partner?.name}</span>
                    : (selectedPartnerData?.name)
                        ? <>
                            <span className="py-2 w-full">{selectedPartnerData?.name}</span>
                            <span
                                onClick={() => { handleShowList('selectPartner'); setSelectedPartnerId(null) }}
                                className="border border-border_color cursor-pointer rounded-md h-fit">
                                <MinusIcon />
                            </span>
                        </>
                        : <span onClick={() => handleShowList('selectPartner')} className='py-2 w-full text-gray-400 cursor-pointer'>Select Partner</span>}
            </div>

            {(selectedMemberData.children?.length > 0 || newChildrenData.children.length > 0 || selectedPartnerData?.children?.length > 0) &&
                <div>
                    <h3 className="text-sm">Children</h3>
                    <>
                        {selectedMemberData.children?.map((item: { id: any, name: string }) => (
                            <div key={item?.id} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-[10px] cursor-not-allowed" >
                                <span className="py-2 w-full">{item?.name}</span>
                            </div>)
                        )}
                    </>
                    <>
                        {selectedPartnerData?.children.map((item: { id: any, name: string }) => (
                            <div key={item?.id} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-[10px] cursor-not-allowed" >
                                <span className="py-2 w-full">{item?.name}</span>
                            </div>)
                        )}
                    </>
                    <>
                        {newChildrenData?.children.map((item: { id: any, name: string, verified: boolean }, index) => (
                            <div key={index} className={`w-full flex justify-between items-center px-2 border active:border-dashed bg-field_color border-border_color text-sm rounded-md mb-[10px] ${newChildrenData.children.length > 1 ? 'cursor-grab' : 'cursor-pointer'} ${draggedOverIndex === index ? 'bg-field_hover' : ''} `}
                                ref={(el) => { itemRefs.current[index] = el; }}
                                draggable={true}
                                onDragStart={() => handleDragStart(index)}
                                onDragEnter={() => handleDragEnter(index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onTouchStart={(e) => handleTouchStart(index, e)}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                <span className="py-2 w-full">{item?.name}</span>
                                <span
                                    onClick={() => { handleSelectedValue(item?.name, item?.id, 'selectChildren', item?.verified) }}
                                    className="border border-border_color rounded-md h-fit cursor-pointer">
                                    <MinusIcon />
                                </span>
                            </div>)
                        )}
                    </>
                </div>}
            {(selectedMemberData.partner?.name || selectedPartnerData?.name) &&
                <div onClick={() => handleShowList('selectChildren')} className={`flex items-center bg-field_color cursor-pointer ${(showListFor === 'selectChildren' && showList) ? 'outline-2 outline-dashed outline-offset-2 outline-border_active' : ''} text-xs ml-0 mr-auto py-1 px-4 border border-border_color rounded-full w-fit mb-2`}>
                    <span className="pr-2">Add Children</span>
                    <span className="w-4 h-4"><PlusIcon /></span>
                </div>}

            {
                (selectedMemberData.verified ||
                    selectedPartnerData.verified ||
                    newChildrenData.children.some((child: any) => child.verified)) &&
                <p className='mt-2'><span className='inline-block align-bottom pr-1'><Info /></span> This change involves verified member, so updates will require moderator approval before they take effect.</p>
            }
            <div className='mt-8 mb-4'>
                {submitError && <p className="text-text_color text-sm mb-2 flex items-start gap-2"><span className='-mt-0.5'><Info /></span>{submitError}</p>}
                <ButtonSolid type="submit" className="w-full" disabled={submitting} buttonText={submitting ? "Adding..." : "Add Relationship"} />
            </div>
        </form>
    )
}

export default AddRelationShipForm;