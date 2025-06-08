'use client'
import { ChangeMember, Info } from '@/utils/Icons'
import React from 'react'
import Input from '@/components/Input'
import { ButtonSolid } from '@/components/Button'
import RadioButton from "@/components/RadioButton";
import { useToast } from '../Toast';

function EditMemberForm({
        handleSubmit,
        formData,
        setShowList,
        handleInputChange,
        errors,
        allowedEdit,
        submitting
    }: any) {

    const toast = useToast();
    const showWarning = (input: string) => {
        toast?.show(`Can not change ${input} for this member`, "warning", 5000);
    }

    const getCurrentISTYear = () => {
      return new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
      });
    };

    const currentYear = parseInt(getCurrentISTYear(), 10);

    // show and hide death details fields based on checkbox
    const showDeathDetails = formData.deceased ? "peer-checked:block" : "hidden";

    return (
        <form className="text-text_color relative" onSubmit={handleSubmit}>
            {!formData.id  && <div onClick={() => setShowList(true)} className={`absolute inset-0 z-10`}></div>}
            <div className="w-full">
                <span className="text-sm font-medium">Name</span>
                <div className={`border border-border_color z-0 rounded-md overflow-hidden bg-field_color flex items-center relative ${!formData.id  && 'outline-2 outline-dashed outline-offset-2 outline-border_active'}`}>
                    <input
                        className={`p-2 outline-none focus:border-border_active text-sm w-full bg-field_color disabled:cursor-not-allowed`}
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                    />
                    <div onClick={() => setShowList(true)} className="cursor-pointer bg-main_background z-50 border border-border_color px-1 flex justify-center items-center rounded-md w-fit h-8 mr-[2px]">
                        <ChangeMember />
                    </div>
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}

                {formData.verified && <p className='mt-2'><span className='inline-block align-bottom pr-1'><Info /></span>This member is already verified. so updated will require moderator approval before they take effect.</p>}
            </div>
            <div className="flex gap-2 py-4">
                <p className="text-sm font-medium">Gender:</p>
                <RadioButton
                    label="Male"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={allowedEdit.editGender ? () => {showWarning('gender')} : handleInputChange}
                />
                <RadioButton
                    label="Female"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={allowedEdit.editGender ? () => {showWarning('gender')} : handleInputChange}
                />
            </div>
            <div>
                <p className="text-sm font-medium">
                    Date Of Birth
                </p>
                <div className="w-full mb-2 flex gap-2">
                    <Input
                        type="number"
                        placeholder="DD"
                        name="birth_date"
                        min="1"
                        max="31"
                        value={formData.birth_date || ''}
                        onChange={handleInputChange}
                    />
                    <Input
                        type="number"
                        placeholder="MM"
                        name="birth_month"
                        min="1"
                        max="12"
                        value={formData.birth_month || ''}
                        onChange={handleInputChange}
                    />
                    <Input
                        type="number"
                        placeholder="YYYY(Opt)"
                        name="birth_year"
                        min="1600"
                        max={currentYear}
                        value={formData.birth_year || ''}
                        onChange={handleInputChange}
                    />
                </div>
                {(errors.birth_day) && (
                    <p className="text-red-500 text-sm mt-2">
                    {errors.birth_day}
                    </p>
                )}
            </div>
            <div className='relative py-2'>
                <div className="pb-2">
                    <p className="text-sm font-medium pr-2 inline-block">Deceased</p>
                    <input
                        type="checkbox"
                        className="peer align-middle inline-block bg-main_background border border-border_active rounded-md"
                        name="deceased"
                        checked={formData.deceased}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={`${showDeathDetails} pt-2`}>
                    <p className="text-sm font-medium">Date Of Death</p>
                    <p className='text-xs font-extralight absolute top-[14px] left-[100px]'>(Remove checkmark if not Deceased)</p>
                    <div className="w-full flex gap-2">
                        <Input
                            type="number"
                            placeholder="DD(Opt)"
                            name="death_date"
                            min="1"
                            max="31"
                            value={formData.death_date || ''}
                            onChange={handleInputChange}
                        />
                        <Input
                            type="number"
                            placeholder="MM"
                            name="death_month"
                            min="1"
                            max="12"
                            value={formData.death_month || ''}
                            onChange={handleInputChange}
                        />
                        <Input
                            type="number"
                            placeholder="YYYY"
                            name="death_year"
                            min="1600"
                            max={currentYear}
                            value={formData.death_year || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    {(errors.death_day) && (
                    <p className="text-red-500 text-sm mt-2">
                        {errors.death_day}
                    </p>
                    )}
                </div>
            </div>
            <div className='mb-2'>
                <Input
                type="text"
                name="phone_number"
                label="Phone Number"
                maxLength={25}
                value={formData.phone_number || ''}
                error={errors.phone_number}
                onChange={handleInputChange}
                />
            </div>
            <Input
                className="mb-2"
                label="Occupation"
                name="occupation"
                value={formData.occupation || ''}
                onChange={handleInputChange}
            />
            <Input
                className="mb-2"
                label="Education"
                name="education"
                value={formData.education || ''}
                onChange={handleInputChange}
            />
            <Input
                className="mb-4"
                label="Location State/Country"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
            />
            <div className="flex justify-start items-center gap-2">
                <p className="text-sm font-medium">Family descendant: </p>
                {["Yes", "No"].map((option) => (
                <RadioButton
                    key={option}
                    label={option}
                    name="descendant"
                    value={option} // "Yes" maps to true, "No" maps to false
                    checked={formData.descendant === option }
                    onChange={allowedEdit.editDescendant ? () => {showWarning('descendancy')} : handleInputChange }
                />
                ))}
            </div>
            {formData?.descendant === 'No' && 
            <div className="p-2 mt-4 border border-border_color rounded-lg">
                <div className="flex gap-2 mb-2">
                    <div>
                        <Input
                        showOptional={true}
                        name="father"
                        label="Father"
                        value={formData.father || ''}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Input
                        showOptional={true}
                        name="mother"
                        label="Mother"
                        value={formData.mother || ''}
                        onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div>
                    <Input
                        showOptional={true}
                        name="siblings"
                        label="Siblings"
                        placeholder="Name1, Name2, ..."
                        value={formData.siblings || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>}
            <ButtonSolid type="submit" className="w-full mt-8 mb-4" buttonText={submitting ? "Updateing..." : "Update Details"} />
        </form>
    )
}

export default EditMemberForm