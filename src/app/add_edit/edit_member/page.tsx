"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { ButtonSolid, LinkButtonOutline } from "@/components/Button";
import Input from "@/components/Input";
import RadioButton from "@/components/RadioButton";
import MemberList from "@/components/MemberList";
import { BackButton, ChangeMember, EditMember, ResetData } from "@/utils/Icons";
import { useToast } from "@/components/Toast";
import { EditMemberDefaultFormErrorValue, EditMemberDefaultFormValue, EditMemberFormErrorTypes, EditMemberFormValueTypes } from "@/types/add__edit/edit_member/types";

export default function EditMemberDetails () {
  const toast = useToast();
  const [formData, setFormData] = useState<EditMemberFormValueTypes>(EditMemberDefaultFormValue);
  const [errors, setErrors] = useState<EditMemberFormErrorTypes>(EditMemberDefaultFormErrorValue);
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false);
  const [showListFor, setShowListFor] = useState('selectMember');
  const [showList, setShowList] = useState(false);
  
  const handleSelectedValue = (item: any, id: string) => {
    setFormData((prev: any) => ({...prev, ['name']: { id, name: item }}));
    setShowList(false)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowList(false)

    const { name, value, type, checked } = e.target;
    const id = formData.name?.id

    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" 
        ? { id:id, name: value }
        : type === "checkbox" 
        ? checked 
        : value,
    }));

    // Clear error when input is updated
    setErrors((prev) => ({ ...prev, [name]: "" })); 
  };

  // show and hide death details fields based on checkbox
  const showDeathDetails = formData.deceased ? "peer-checked:block" : "hidden"; 

  const handleShowList = (field: string) => {
    setShowListFor(field);
    setErrors(EditMemberDefaultFormErrorValue);
    if (formData.name?.id) {
      setShowList(prev => !prev);
    } else {
      setShowList(true);
    }
  };

  const showWarning = (input: string) => {
    if (toast) {
      toast.show(`Can not change ${input} for this user`, "warning", 5000);
    }
  }

  useEffect(() => {
    if (formData.name?.id) {
      const fetchUser = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/editMember/${formData.name?.id}`);
          if (!response.ok) throw new Error('Failed to fetch user details');
      
          const { data } = await response.json();
          const dbData = data[0];

          const formatedDbData = {
            name: {id: parseInt(`${dbData.id}`), name: `${dbData.name}`},
            gender: dbData.gender ? dbData.gender === "Male" ? "Male" : "Female" : undefined,
            birth_date: dbData.birthDate || null,
            birth_month: dbData.birthMonth || null,
            birth_year: dbData.birthYear || null,
            deceased: dbData.deceased,
            death_date: dbData.deathDate || null,
            death_month: dbData.deathMonth || null,
            death_year: dbData.deathYear || null,
            phone_number: dbData.phoneNumber,
            occupation: dbData.occupation,
            education: dbData.education,
            address: dbData.address,
            descendant: (dbData.descendant == true) ? 'Yes' : 'No',

            fatherId: dbData.fatherId,
            motherId: dbData.motherId,
            hasPartner: dbData.partnerId ? true : false,
            isParent: (dbData.fatherOf.length > 0 || dbData.motherOf.length > 0) ? true : false,

            father: dbData.partnersRelation[0]?.father,
            mother: dbData.partnersRelation[0]?.mother,
            sibling: dbData.partnersRelation[0]?.SiblingsNames
          }
          setFormData(formatedDbData);
        } catch (error: any) {
          if (toast) {
            toast.show(error.message || "Failed to update member", "error", 5000);
          } else {
            alert(error.message || "Failed to update member.");
          }
        } finally {
          setLoading(false)
        }
      }
  
      fetchUser()
    }
  }, [formData.name?.id])

  // Validate required fields
  const validateForm = () => {
    const errors: any = {};
  
    if (!formData.name?.name) errors.name = "Name is required";
    if (formData.name?.name == 'undefined' || formData.name?.name == 'Undefined') errors.name = "Can not use this nane";
    if (formData.birth_date && !formData.birth_month) errors.birth_date = "Date of birth requires a month";
    if (formData.birth_month && !formData.birth_date) errors.birth_month = "Date of birth requires a date";
    if (formData.birth_year && (!formData.birth_month || !formData.birth_date)) errors.birth_year = "Date and month are required";
  
    if (formData.deceased) {
      if (formData.death_date && (!formData.death_month || !formData.death_year)) 
        errors.death_date = "Month and year are required";
      if (formData.death_month && !formData.death_year) errors.death_month = "Death anniversary requires a year";
      if (formData.death_year && !formData.death_month) errors.death_year = "Death anniversary requires a month";
    }
  
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      setSubmitting(true);
  
      const deceased = formData.deceased;
      const descendant = formData.descendant === "Yes";
      const memberData = {
        name: formData.name?.name,
        gender: formData.gender,
        birthDate: formData.birth_date ? parseInt(formData.birth_date, 10) : null,
        birthMonth: formData.birth_month ? parseInt(formData.birth_month, 10) : null,
        birthYear: formData.birth_year ? parseInt(formData.birth_year, 10) : null,
        deceased: deceased,
        deathDate: deceased ? formData.death_date ? parseInt(formData.death_date, 10) : null : null,
        deathMonth: deceased ? formData.death_month ? parseInt(formData.death_month, 10) : null : null,
        deathYear: deceased ? formData.death_year ? parseInt(formData.death_year, 10) : null : null,
        phoneNumber: formData.phone_number,
        occupation: formData.occupation,
        education: formData.education,
        address: formData.address,
        descendant: descendant,
        father: descendant ? null : formData.father, 
        mother: descendant ? null : formData.mother,
        sibling: descendant ? null : formData.sibling
      };
  
      const response = await fetch(`/api/editMember/${formData.name?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update member");
      }
  
      const result = await response.json();
      console.log("Member updated successfully:", result);
  
      if (toast) {
        toast.show("Member updated successfully", "success", 5000);
      }
  
      setFormData(EditMemberDefaultFormValue);
      setErrors(EditMemberDefaultFormErrorValue);
    } catch (error: any) {
      if (toast) {
        toast.show(error.message || "Failed to update member", "error", 5000);
      } else {
        alert(error.message || "Failed to update member.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="md:flex text-text_color">
      <Container className='relative'>
        {loading && <div className={`absolute inset-0 flex justify-center items-start bg-gray-50/30 z-10`}>
            <p className="mt-20 px-2 bg-field_color border border-border_color rounded-md z-[100]">loading...</p>
          </div>}
        <div className="w-full md:max-w-xl p-4 mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <span className="hidden md:block"><EditMember /></span>
              <Link href={"/add_edit"} className="md:hidden block">
                <span><BackButton /></span>
              </Link>
              <p className="cursor-default text-2xl font-semibold text-text_color underline pl-3">
                Edit {formData.name?.name ? formData.name?.name  :'Member'}
              </p>
            </div>
          </div>
          <form className="text-text_color relative" onSubmit={handleSubmit}>
            {!formData.name?.name  && <div onClick={() => handleShowList('selectMember')} className={`absolute inset-0 z-10`}></div>}
            <div className="w-full">
              <span className="text-sm font-medium" >Name</span>
              <div className={`border border-border_color z-0 rounded-md overflow-hidden bg-field_color flex items-center relative ${!formData.name?.name  && 'outline-2 outline-dashed outline-offset-2 outline-border_active'}`}>
                <input
                  onClick={() => setShowList(false)}
                  className={`p-2 outline-none focus:border-border_active text-sm w-full bg-field_color`}
                  type="text"
                  name="name"
                  value={formData.name?.name || ''}
                  onChange={handleInputChange}
                />
                <div onClick={() => handleShowList('selectMember')} className="cursor-pointer bg-main_background z-50 border border-border_color px-1 flex justify-center items-center rounded-md w-fit h-8 mr-[2px]">
                  <ChangeMember />
                </div>
              </div>
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="flex gap-2 py-4">
              <p className="text-sm font-medium">Gender:</p>
              <RadioButton
                label="Male"
                name="gender"
                // disabled = {formData.hasPartner || formData.isParent}
                value="Male"
                checked={formData.gender === "Male"}
                onChange={formData.hasPartner || formData.isParent ? () => {showWarning('gender')} : handleInputChange}
              />
              <RadioButton
                label="Female"
                name="gender"
                // disabled = {formData.hasPartner || formData.isParent}
                value="Female"
                checked={formData.gender === "Female"}
                onChange={formData.hasPartner || formData.isParent ? () => {showWarning('gender')} : handleInputChange}
              />
            </div>
            <div>
              <p className="text-sm font-medium">
                Date Of Birth
              </p>
              <div className="w-full mb-2 flex gap-2">
                <Input
                  onClick={() => setShowList(false)}
                  type="number"
                  placeholder="DD"
                  name="birth_date"
                  min="1"
                  max="31"
                  value={formData.birth_date || ''}
                  onChange={handleInputChange}
                />
                <Input
                  onClick={() => setShowList(false)}
                  type="number"
                  placeholder="MM"
                  name="birth_month"
                  min="1"
                  max="12"
                  value={formData.birth_month || ''}
                  onChange={handleInputChange}
                />
                <Input
                  onClick={() => setShowList(false)}
                  type="number"
                  placeholder="YYYY(Opt)"
                  name="birth_year"
                  min="1975"
                  max={new Date().getFullYear()}
                  value={formData.birth_year || ''}
                  onChange={handleInputChange}
                />
              </div>
              {(errors.birth_date || errors.birth_month || errors.birth_year) && (
                <p className="text-red-500 text-sm">
                  {errors.birth_date || errors.birth_month || errors.birth_year}
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
                  checked={formData.deceased || false}
                  onChange={handleInputChange}
                />
              </div>
              <div className={`${showDeathDetails} pt-2`}>
                <p className="text-sm font-medium">Date Of Death</p>
                <p className='text-xs font-extralight absolute top-[14px] left-[100px]'>(Remove checkmark if not Deceased)</p>
                <div className="w-full flex gap-2">
                  <Input
                    onClick={() => setShowList(false)}
                    type="number"
                    placeholder="DD(Opt)"
                    name="death_date"
                    min="1"
                    max="31"
                    value={formData.death_date || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    onClick={() => setShowList(false)}
                    type="number"
                    placeholder="MM"
                    name="death_month"
                    min="1"
                    max="12"
                    value={formData.death_month || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    onClick={() => setShowList(false)}
                    type="number"
                    placeholder="YYYY"
                    name="death_year"
                    min="1975"
                    max={new Date().getFullYear()}
                    value={formData.death_year || ''}
                    onChange={handleInputChange}
                  />
                </div>
                {(errors.death_month || errors.death_year || errors.death_date) && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.death_year || errors.death_month || errors.death_date}
                  </p>
                )}
              </div>
            </div>
            <Input
              onClick={() => setShowList(false)}
              className="mb-2"
              type="number"
              name="phone_number"
              label="Phone Number"
              value={formData.phone_number || ''}
              onChange={handleInputChange}
            />
            <Input
              onClick={() => setShowList(false)}
              className="mb-2"
              label="Occupation"
              name="occupation"
              value={formData.occupation || ''}
              onChange={handleInputChange}
            />
            <Input
              onClick={() => setShowList(false)}
              className="mb-2"
              label="Education"
              name="education"
              value={formData.education || ''}
              onChange={handleInputChange}
            />
            <Input
              onClick={() => setShowList(false)}
              className="mb-4"
              label="Address"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
            />
            <div className="flex justify-start items-center gap-2">
              <p className="text-sm font-medium">Family descendant:</p>
              {["Yes", "No"].map((option) => (
              <RadioButton
                key={option}
                label={option}
                name="descendant"
                value={option} // "Yes" maps to true, "No" maps to false
                checked={formData.descendant === option }
                onChange={formData.fatherId || formData.motherId ? () => {showWarning('descendancy')} : handleInputChange }
              />
            ))}
            </div>
            {formData?.descendant === 'No' && <div className="p-2 mt-4 border border-border_color rounded-lg">
            <div className="flex gap-2 mb-2">
              <div>
                <Input
                  showOptional={true}
                  name="mother"
                  label="Mother"
                  value={formData.mother || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Input
                  showOptional={true}
                  name="father"
                  label="Father"
                  value={formData.father || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <Input
                showOptional={true}
                name="sibling"
                label="Siblings"
                placeholder="Name1, Name2, ..."
                value={formData.sibling || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>}
            <ButtonSolid type="submit" className="w-full mt-8 mb-4" buttonText={submitting ? "Update..." : "Add Member"} />
          </form>
          <LinkButtonOutline buttonText="Cancel" linkto="/add_edit" className="hidden md:block" />
        </div>
      </Container>
      {showList && (
      <div
        onClick={() => setShowList(false)}
        className={`fixed md:hidden ${showList ? 'top-0 bg-gray-500/60' : 'bottom-full delay-300 bg-gray-300/5'} inset-0 z-[100] duration-500 ease-in-out`}
      /> )}
      <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background overflow-x-hidden ${showList ? 'md:border-l md:border-border_color z-[100] rounded-t-md md:rounded-none -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full lg:max-w-lg mx-auto overflow-y-auto`}>
        <div className={`overflow-x-hidden ${showList ? 'visible md:delay-300 transition-all ease-in-out' : 'invisible'}`}>
          <MemberList forType={showListFor} getSelectedValues={formData} setSelectedValue={handleSelectedValue} openList={setShowList} multiselect={'selectChildren' === showListFor} descendant={null} />
        </div>
      </div>
    </div>
  );
}