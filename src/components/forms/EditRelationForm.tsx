import React, { useRef, useState } from 'react'
import { ButtonSolid } from '../Button'
import { ChangeMember, CloseIcon, Divorced, Error, Info } from '@/utils/Icons'

function EditRelationShipForm({
    handleShowList,
    handleDivorcePartner,
    handleRemoveChildrenValue,
    handleSubmit,
    formData,
    setFormData,
    setNoChanges,
    submitting,
    submitError,
    allowSwitch
}: any) {

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
        const list = [...formData.children];
        const dragItemContent = list[dragItem.current];
        list.splice(dragItem.current, 1);
        list.splice(dragOverItem.current, 0, dragItemContent);
        setFormData({ ...formData, children: list });
        setNoChanges(false);
        setIsDragging(false);
        setDraggedOverIndex(null);
    };

    const handleTouchStart = (index: number, e: React.TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        touchStartPos.current = { x: touch.clientX, y: touch.clientY };
        dragItem.current = index
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
            {!formData.name && <div onClick={() => handleShowList()} className={`absolute inset-0 z-10`}></div>}
            <p className="text-sm">Member</p>
            <div
                onClick={() => handleShowList()}
                className={`w-full flex justify-between ${!formData.name || formData.name == 'undefined' ? 'outline-2 outline-dashed outline-offset-2 outline-border_active' : ''} items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-[0.625rem] cursor-pointer`}
            >
                {formData.name && formData.name !== 'undefined' ?
                    <>
                        <span className="py-2 w-full">{formData.name}</span>
                        {allowSwitch && <span><ChangeMember /></span>}
                    </> :
                    <span className='py-2 w-full text-gray-400'>Select Member</span>}
            </div>
            {!formData.name || formData.name === 'undefined' ?
                <>
                    <p className="text-sm">Partner</p>
                    <div className="w-full px-2 border bg-field_color border-border_color text-sm rounded-md mb-[0.625rem] cursor-pointer" >
                        <span className='block py-2 w-full text-gray-400'>Select Partner</span>
                    </div>
                </> :
                formData.partner && formData.partner?.name !== 'undefined' ?
                    <>
                        <p className="text-sm">Partner</p>
                        <div className="w-full flex justify-between items-center pl-2 pr-[0.1875rem] border bg-field_color border-border_color text-sm rounded-md mb-2" >
                            <span className="py-2 w-full">{formData.partner?.name}</span>
                            <div className="flex gap-2 items-center border border-border_color px-1 py-0.5 rounded-md">
                                <span
                                    onClick={() => handleDivorcePartner()}
                                    className="block w-9 h-6 cursor-pointer">
                                    <Divorced />
                                </span>
                            </div>
                        </div>
                    </> :
                    <></>
            }
            {formData.children.length > 0 &&
                <>
                    <p className="text-sm">Children</p>
                    {formData.children.map((child: { id: number, name: string }, index: number) => (
                        <div key={index} className={`w-full flex justify-between items-center px-2 border active:border-dashed bg-field_color border-border_color text-sm rounded-md mb-2 ${formData.children.length > 1 ? 'cursor-grab' : 'cursor-pointer'} ${draggedOverIndex === index ? 'bg-field_hover' : ''}`}
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
                            <span className="py-2 w-full">{child.name}</span>
                            <span
                                onClick={() => handleRemoveChildrenValue(child.id)}
                                className="border border-border_color rounded-md h-fit  cursor-pointer">
                                <CloseIcon />
                            </span>
                        </div>)
                    )}
                </>}
            {formData.hasVerified && <p><span className='inline-block align-bottom pr-1'><Info /></span> This change involves verified member, so updates will require <b>moderator approval</b> before they take effect.</p>}
            <div className='mt-8 mb-4'>
                {submitError && <p className="text-text_color text-sm mb-2 flex items-start gap-1"><span className='-mt-0.5'><Error /></span><span dangerouslySetInnerHTML={{ __html: submitError }} /></p>}
                <ButtonSolid type="submit" className="w-full" disabled={submitting} buttonText={submitting ? "Updating..." : "Update Details"} />
            </div>
        </form>
    )
}

export default EditRelationShipForm
