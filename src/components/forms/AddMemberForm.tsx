import React from 'react'
import { ButtonSolid, LinkButtonOutline } from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import RadioButton from "@/components/RadioButton";
import { AddMemberFormValueTypes, AddMemberFormErrorTypes } from '@/types/add__edit/add_member/types';

interface AddMemberFormProps {
    formData: AddMemberFormValueTypes;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleFormSubmit: (e: React.FormEvent) => void;
    errors: AddMemberFormErrorTypes;
    loading: boolean;
    head: string | null;
}

function AddMemberForm({ formData, handleInputChange, handleFormSubmit, errors, loading, head }: AddMemberFormProps) {
    const showDeathDetails = formData?.deceased ? "peer-checked:block" : "hidden";
    const getCurrentISTYear = () => {
        return new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
        });
    };

    const currentYear = parseInt(getCurrentISTYear(), 10);
    return (
        <form className="text-text_color" onSubmit={handleFormSubmit}>
            <Input
                name="name"
                label="Name"
                value={formData.name || ''}
                onChange={handleInputChange}
                error={errors.name}
            />
            <div className="py-4">
                <div className="flex gap-4">
                    <p className="text-sm font-medium">Gender:</p>
                    <RadioButton
                        label="Male"
                        name="gender"
                        value="Male"
                        checked={formData.gender === "Male"}
                        onChange={handleInputChange}
                    />
                    <RadioButton
                        label="Female"
                        name="gender"
                        value="Female"
                        checked={formData.gender === "Female"}
                        onChange={handleInputChange}
                    />
                </div>
                {(errors.gender) && (
                    <p className="text-red-500 text-sm">
                        {errors.gender}
                    </p>
                )}
            </div>
            <div>
                <p className="text-sm font-medium">
                    Date Of Birth<span className="font-normal opacity-45 pl-2">(Optional)</span>
                </p>
                <div className="w-full mb-2 flex gap-2">
                    <Input
                        type="number"
                        placeholder="DD"
                        name="birth_date"
                        min="1"
                        max="31"
                        maxLength={2}
                        label=""
                        value={formData.birth_date || ''}
                        onChange={handleInputChange}
                    />
                    <Input
                        type="number"
                        placeholder="MM"
                        name="birth_month"
                        min="1"
                        max="12"
                        maxLength={2}
                        label=""
                        value={formData.birth_month || ''}
                        onChange={handleInputChange}
                    />
                    <Input
                        type="number"
                        placeholder="YYYY(Opt)"
                        name="birth_year"
                        min="1600"
                        max={currentYear}
                        maxLength={4}
                        label=""
                        value={formData.birth_year || ''}
                        onChange={handleInputChange}
                    />
                </div>
                {(errors.birth_day) && (
                    <p className="text-red-500 text-sm">
                        {errors.birth_day}
                    </p>
                )}
            </div>
            <div className="relative py-2">
                <div className="pb-2">
                    <p className="text-sm font-medium pr-2 inline-block">Deceased</p>
                    <input
                        type="checkbox"
                        className="peer align-middle inline-block bg-main_background border border-border_active rounded-md"
                        name="deceased"
                        checked={formData.deceased || false}
                        onChange={handleInputChange}
                    />
                </div>

                <div className={`${showDeathDetails} pt-2`}>
                    <p className="text-sm font-medium">
                        Date Of Death<span className="font-normal opacity-45 pl-2">(Optional)</span>
                    </p>
                    <p className="text-xs font-extralight absolute top-[14px] left-[100px]">
                        (Remove checkmark if not Deceased)
                    </p>
                    <div className="w-full flex gap-2">
                        <Input
                            type="number"
                            placeholder="DD(Opt)"
                            name="death_date"
                            min="1"
                            max="31"
                            maxLength={2}
                            label=""
                            value={formData.death_date || ''}
                            onChange={handleInputChange}
                        />
                        <Input
                            type="number"
                            placeholder="MM"
                            name="death_month"
                            min="1"
                            max="12"
                            maxLength={2}
                            label=""
                            value={formData.death_month || ''}
                            onChange={handleInputChange}
                        />
                        <Input
                            type="number"
                            placeholder="YYYY"
                            name="death_year"
                            min="1600"
                            max={currentYear}
                            maxLength={4}
                            label=""
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
                    showOptional={true}
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
                showOptional={true}
                name="occupation"
                label="Occupation"
                value={formData.occupation || ''}
                onChange={handleInputChange}
            />
            <Input
                className="mb-2"
                showOptional={true}
                name="education"
                label="Education"
                value={formData.education || ''}
                onChange={handleInputChange}
            />
            <Input
                className="mb-4"
                showOptional={true}
                name="address"
                label="Address State/Country"
                value={formData.address || ''}
                onChange={handleInputChange}
            />
            <TextArea
                className="mb-4"
                showOptional={true}
                name="additionalInfo"
                label="Additional Info"
                value={formData.additionalInfo || ''}
                onChange={handleInputChange}
            />
            <div className="flex justify-start items-center gap-4">
                <p className="text-sm font-medium">{head ? `${head}` : 'Family'} descendant:</p>
                {["Yes", "No"].map((option) => (
                    <RadioButton
                        key={option}
                        label={option}
                        name="descendant"
                        value={option} // "Yes" maps to true, "No" maps to false
                        checked={formData.descendant === option}
                        onChange={handleInputChange}
                    />
                ))}
            </div>
            {(errors.descendant) && (
                <p className="text-red-500 text-sm">
                    {errors.descendant}
                </p>
            )}
            {formData?.descendant === 'No' && <div className="p-2 mt-4 border border-border_color rounded-lg">
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
            <ButtonSolid type="submit" disabled={loading} className="w-full mt-8 mb-4" buttonText={loading ? "Adding..." : "Add Member"} />
        </form>
    )
}

export default AddMemberForm