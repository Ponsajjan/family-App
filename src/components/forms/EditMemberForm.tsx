'use client'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ChangeMember, Error, Info } from '@/utils/Icons'
import Input from '@/components/Input'
import TextArea from '@/components/TextArea'
import { ButtonSolid } from '@/components/Button'
import RadioButton from "@/components/RadioButton";
import { useToast } from '../Toast';
import { appFetch } from '@/utils/appFetch';

function EditMemberForm({
    handleSubmit,
    formData,
    setShowList,
    handleInputChange,
    handleDateBlur,
    errors,
    allowedEdit,
    submitting,
    submitError
}: any) {

    const head = useSelector((state: RootState) => state.terms.mainMemberName);
    const toast = useToast();
    const [options, setOptions] = useState<{
        occupations: string[],
        educations: string[],
        birthPlaces: string[],
        countries: string[],
        states: string[],
        districts: string[],
        cities: string[]
    }>({
        occupations: [],
        educations: [],
        birthPlaces: [],
        countries: [],
        states: [],
        districts: [],
        cities: []
    });

    const showWarning = (input: string) => {
        toast?.show(`Can not change ${input} for this member`, "warning", 5000);
    }

    useEffect(() => {
        const fetchInitialOptions = async () => {
            try {
                const res = await appFetch('/api/relatives/filterOptions');
                if (res.ok) {
                    const data = await res.json();
                    setOptions(prev => ({ ...prev, ...data }));
                }
            } catch (err) {
                console.error("Failed to fetch filter options", err);
            }
        };
        fetchInitialOptions();
    }, []);

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
            {!formData.id && <div onClick={() => setShowList(true)} className={`absolute inset-0 z-10`}></div>}
            <div className="w-full">
                <span className="text-sm font-medium">Name</span>
                <div className={`border border-border_color z-0 rounded-md overflow-hidden bg-field_color flex items-center relative ${!formData.id && 'outline-2 outline-dashed outline-offset-2 outline-border_active'}`}>
                    <input
                        className={`p-2 outline-none focus:border-border_active text-sm w-full bg-field_color disabled:cursor-not-allowed`}
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                    />
                    <div onClick={() => setShowList(true)} className="cursor-pointer bg-main_background z-50 border border-border_color px-1 flex justify-center items-center rounded-md w-fit h-8 mr-[0.125rem]">
                        <ChangeMember />
                    </div>
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}

                {formData.verified && <p className='mt-2'><span className='inline-block align-bottom pr-1'><Info /></span>This member is already verified. so updated will require <b>moderator approval</b> before they take effect.</p>}
            </div>
            <div className="flex gap-4 py-4">
                <p className="text-sm font-medium">Gender:</p>
                <RadioButton
                    label="Male"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={allowedEdit.editGender ? () => { showWarning('gender') } : handleInputChange}
                />
                <RadioButton
                    label="Female"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={allowedEdit.editGender ? () => { showWarning('gender') } : handleInputChange}
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
                        onBlur={handleDateBlur}
                    />
                    <Input
                        type="number"
                        placeholder="MM"
                        name="birth_month"
                        min="1"
                        max="12"
                        value={formData.birth_month || ''}
                        onChange={handleInputChange}
                        onBlur={handleDateBlur}
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
                    <p className='text-xs font-extralight absolute top-[0.875rem] left-[6.25rem]'>(Remove checkmark if not Deceased)</p>
                    <div className="w-full flex gap-2">
                        <Input
                            type="number"
                            placeholder="DD(Opt)"
                            name="death_date"
                            min="1"
                            max="31"
                            value={formData.death_date || ''}
                            onChange={handleInputChange}
                            onBlur={handleDateBlur}
                        />
                        <Input
                            type="number"
                            placeholder="MM"
                            name="death_month"
                            min="1"
                            max="12"
                            value={formData.death_month || ''}
                            onChange={handleInputChange}
                            onBlur={handleDateBlur}
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
                list="edit-occupations-list"
                value={formData.occupation || ''}
                onChange={handleInputChange}
            />
            <datalist id="edit-occupations-list">
                {options.occupations.map(opt => <option key={opt} value={opt} />)}
            </datalist>

            <Input
                className="mb-2"
                label="Education"
                name="education"
                list="edit-educations-list"
                value={formData.education || ''}
                onChange={handleInputChange}
            />
            <datalist id="edit-educations-list">
                {options.educations.map(opt => <option key={opt} value={opt} />)}
            </datalist>

            <Input
                className="mb-3"
                label="Birth Place"
                name="birthPlace"
                list="edit-birthPlaces-list"
                value={formData.birthPlace || ''}
                onChange={handleInputChange}
            />
            <datalist id="edit-birthPlaces-list">
                {options.birthPlaces.map(opt => <option key={opt} value={opt} />)}
            </datalist>

            <div className='border border-border_color p-2 rounded-lg mb-2'>
                <TextArea
                    className="mb-1"
                    label="Current Address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <div>
                        <Input
                            name="city"
                            label="City/Town"
                            list="edit-cities-list"
                            value={formData.city || ''}
                            onChange={handleInputChange}
                        />
                        <datalist id="edit-cities-list">
                            {options.cities.map(opt => <option key={opt} value={opt} />)}
                        </datalist>
                    </div>
                    <div>
                        <Input
                            name="district"
                            label="District"
                            list="edit-districts-list"
                            value={formData.district || ''}
                            onChange={handleInputChange}
                        />
                        <datalist id="edit-districts-list">
                            {options.districts.map(opt => <option key={opt} value={opt} />)}
                        </datalist>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <Input
                            name="state"
                            label="State/Province"
                            list="edit-states-list"
                            value={formData.state || ''}
                            onChange={handleInputChange}
                        />
                        <datalist id="edit-states-list">
                            {options.states.map(opt => <option key={opt} value={opt} />)}
                        </datalist>
                    </div>
                    <div>
                        <Input
                            name="country"
                            label="Country"
                            list="edit-countries-list"
                            value={formData.country || ''}
                            onChange={handleInputChange}
                        />
                        <datalist id="edit-countries-list">
                            {options.countries.map(opt => <option key={opt} value={opt} />)}
                        </datalist>
                    </div>
                </div>
            </div>

            <TextArea
                className="mb-3"
                label="Additional Info"
                name="additionalInfo"
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
                        onChange={allowedEdit.editDescendant ? () => { showWarning('descendancy') } : handleInputChange}
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
            <div className='mt-8 mb-4'>
                {submitError && <p className="text-text_color text-sm mb-2 flex items-start gap-1"><span className='-mt-0.5'><Error /></span><span dangerouslySetInnerHTML={{ __html: submitError }} /></p>}
                <ButtonSolid type="submit" className="w-full" disabled={submitting} buttonText={submitting ? "Updating..." : "Update Details"} />
            </div>

        </form>
    )
}

export default EditMemberForm;