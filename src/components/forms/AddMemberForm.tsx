import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ButtonSolid } from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import RadioButton from "@/components/RadioButton";
import { AddMemberFormValueTypes, AddMemberFormErrorTypes } from '@/types/add__edit/add_member/types';
import { Error } from '@/utils/Icons';
import { appFetch } from '@/utils/appFetch';

interface AddMemberFormProps {
    formData: AddMemberFormValueTypes;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleDateBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    handleFormSubmit: (e: React.FormEvent) => void;
    errors: AddMemberFormErrorTypes;
    loading: boolean;
    submitError: string;
}

function AddMemberForm({ formData, handleInputChange, handleDateBlur, handleFormSubmit, errors, loading, submitError }: AddMemberFormProps) {
    const head = useSelector((state: RootState) => state.terms.mainMemberName);
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

    const showDeathDetails = formData?.deceased ? "peer-checked:block" : "hidden";

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
                <fieldset>
                    <legend className="text-sm font-medium">Gender:</legend>
                    <div className="flex gap-4 mt-1">
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
                </fieldset>
                {(errors.gender) && (
                    <p role="alert" className="text-red-500 text-sm">
                        {errors.gender}
                    </p>
                )}
            </div>
            <div>
                <p id="dob-label" className="text-sm font-medium">
                    Date Of Birth<span className="font-normal opacity-45 pl-2">(Optional)</span>
                </p>
                <div role="group" aria-labelledby="dob-label" className="w-full mb-2 flex gap-2">
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
                        onBlur={handleDateBlur}
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
                        onBlur={handleDateBlur}
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
                    <label htmlFor="deceased-checkbox" className="text-sm font-medium pr-2 inline-block cursor-pointer">Deceased</label>
                    <input
                        id="deceased-checkbox"
                        type="checkbox"
                        role="switch"
                        aria-checked={formData.deceased || false}
                        className="peer align-middle inline-block bg-main_background border border-border_active rounded-md"
                        name="deceased"
                        checked={formData.deceased || false}
                        onChange={handleInputChange}
                    />
                </div>

                <div className={`${showDeathDetails} pt-2`}>
                    <p id="dod-label" className="text-sm font-medium">
                        Date Of Death<span className="font-normal opacity-45 pl-2">(Optional)</span>
                    </p>
                    <p className="text-xs font-extralight absolute top-[0.875rem] left-[6.25rem]">
                        (Remove checkmark if not Deceased)
                    </p>
                    <div role="group" aria-labelledby="dod-label" className="w-full flex gap-2">
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
                            onBlur={handleDateBlur}
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
                            onBlur={handleDateBlur}
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
                list="occupations-list"
                value={formData.occupation || ''}
                onChange={handleInputChange}
            />
            <datalist id="occupations-list">
                {options.occupations.map(opt => <option key={opt} value={opt} />)}
            </datalist>

            <Input
                className="mb-2"
                showOptional={true}
                name="education"
                label="Education"
                list="educations-list"
                value={formData.education || ''}
                onChange={handleInputChange}
            />
            <datalist id="educations-list">
                {options.educations.map(opt => <option key={opt} value={opt} />)}
            </datalist>

            <Input
                className="mb-3"
                showOptional={true}
                name="birthPlace"
                label="Birth Place"
                list="birthPlaces-list"
                value={formData.birthPlace || ''}
                onChange={handleInputChange}
            />
            <datalist id="birthPlaces-list">
                {options.birthPlaces.map(opt => <option key={opt} value={opt} />)}
            </datalist>

            <div className='border border-border_color p-2 rounded-lg mb-2'>
                <TextArea
                    className="mb-1"
                    showOptional={true}
                    name="address"
                    label="Current Address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                />
                <div className="grid grid-col-1 md:grid-cols-2 gap-2 mb-2">
                    <div>
                        <Input
                            showOptional={true}
                            name="city"
                            label="City/Locality"
                            list="cities-list"
                            value={formData.city || ''}
                            onChange={handleInputChange}
                        />
                        <datalist id="cities-list">
                            {options.cities.map(opt => <option key={opt} value={opt} />)}
                        </datalist>
                    </div>
                    <div>
                        <Input
                            showOptional={true}
                            name="district"
                            label="District"
                            list="districts-list"
                            value={formData.district || ''}
                            onChange={handleInputChange}
                        />
                        <datalist id="districts-list">
                            {options.districts.map(opt => <option key={opt} value={opt} />)}
                        </datalist>
                    </div>
                </div>

                <div className="grid grid-col-1 md:grid-cols-2 gap-2">
                    <div>
                        <Input
                            showOptional={true}
                            name="state"
                            label="State/Region"
                            list="states-list"
                            value={formData.state || ''}
                            onChange={handleInputChange}
                        />
                        <datalist id="states-list">
                            {options.states.map(opt => <option key={opt} value={opt} />)}
                        </datalist>
                    </div>
                    <div>
                        <Input
                            showOptional={true}
                            name="country"
                            label="Country"
                            list="countries-list"
                            value={formData.country || ''}
                            onChange={handleInputChange}
                        />
                        <datalist id="countries-list">
                            {options.countries.map(opt => <option key={opt} value={opt} />)}
                        </datalist>
                    </div>
                </div>
            </div>

            <TextArea
                className="mb-3"
                showOptional={true}
                name="additionalInfo"
                label="Additional Info"
                value={formData.additionalInfo || ''}
                onChange={handleInputChange}
            />
            <fieldset>
                <legend className="text-sm font-medium">{head ? `${head}` : 'Family'} descendant:</legend>
                <div className="flex justify-start items-center gap-4 mt-1">
                    {["Yes", "No"].map((option) => (
                        <RadioButton
                            key={option}
                            label={option}
                            name="descendant"
                            value={option}
                            checked={formData.descendant === option}
                            onChange={handleInputChange}
                        />
                    ))}
                </div>
            </fieldset>
            {(errors.descendant) && (
                <p role="alert" className="text-red-500 text-sm">
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
            <div className='mt-8 mb-4'>
                {submitError && <p className="text-text_color text-sm mb-2 flex items-start gap-1"><span className='-mt-0.5'><Error /></span><span dangerouslySetInnerHTML={{ __html: submitError }} /></p>}
                <ButtonSolid type="submit" disabled={loading} className="w-full" buttonText={loading ? "Adding..." : "Add Member"} />
            </div>
        </form>
    )
}

export default AddMemberForm
