"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { ButtonOutline, ButtonSolid, LinkButtonOutline } from "@/components/Button";
import MemberList from "@/components/MemberList";
import { BackButton, ChangeMember, DeleteRecord, EditMember } from "@/utils/Icons";
import { useToast } from "@/components/Toast";
import { AllowedEditTypes, DefaultAllowedEdits, EditMemberDefaultFormErrorValue, EditMemberDefaultFormValue, EditMemberFormErrorTypes, EditMemberFormValueTypes } from "@/types/add__edit/edit_member/types";
import RadioButton from "@/components/RadioButton";
import { validateEditMemberForm } from "@/utils/add_edit/edit_members/validateEditMemberForm";
import { Popup } from "@/components/Popup";
import { getCookie } from 'cookies-next';
import { useRouter } from "next/navigation";
import Topnav from "@/components/Topnav";
import Input from "@/components/Input";

export default function EditMemberModerator () {
  const toast = useToast();
  const [showList, setShowList] = useState(false);
  const [editedMember, setEditedMember] = useState('')
  const [formData, setFormData] = useState<EditMemberFormValueTypes>(EditMemberDefaultFormValue);
  const [allowedEdit, setAllowedEdit] = useState<AllowedEditTypes>(DefaultAllowedEdits);
  const [errors, setErrors] = useState<EditMemberFormErrorTypes>(EditMemberDefaultFormErrorValue);
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false);
  const [deleteOption, setDeleteOption] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const token = getCookie('token');
  const router = useRouter(); 

  const handleSelectedValue = (name: string, id: number) => {
    setFormData((prev) => ({ ...prev, name, id }));
    setShowList(false);
  };
  
  useEffect(() => {
    if (formData.id) {
      const fetchMember = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/editMember/${formData.id}`,
            {
              method: 'GET',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              },
            }
          );
          // Handle 401 Unauthorized
          if (response.status === 401) {
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            router.push('/login');
            return;
          }
          if (!response.ok) throw new Error('Failed to fetch member details');
          const { data } = await response.json();
          setEditedMember(data.formData.name)
          setFormData(data.formData);
          setAllowedEdit(data.allowEdit)
          setDeleteOption(data.allowEdit.deleteOption)
          setErrors(EditMemberDefaultFormErrorValue);
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
  
      fetchMember()
    }
  }, [formData.id, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowList(false)
    const { name, value, type, checked } = e.target;
    const id = formData.id;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" 
        ? checked 
        : value,
    }));
    // Clear error when input is updated
    setErrors((prev) => ({ ...prev, [name]: "" })); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateEditMemberForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setSubmitting(true);
      // const capitalizeWords = (name: string) => {
      //   return name.replace(/\b\w/g, (char) => char.toUpperCase())
      //   .replace(/\b\w+\b/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()); 
      // }

      const deceased = formData.deceased;
      const descendant = formData.descendant === "Yes";
      const memberData = {
        id: formData.id,
        name: formData.name,
        gender: formData.gender,
        birthDate: formData.birth_date || null,
        birthMonth: formData.birth_month || null,
        birthYear: formData.birth_year || null,
        deceased: deceased,
        deathDate: deceased ? formData.death_date || null : null,
        deathMonth: deceased ? formData.death_month || null : null,
        deathYear: deceased ? formData.death_year || null : null,
        phoneNumber: formData.phone_number,
        occupation: formData.occupation,
        education: formData.education,
        address: formData.address,
        descendant: descendant,
        father: descendant ? null : formData.father, 
        mother: descendant ? null : formData.mother,
        siblings: descendant ? null : formData.siblings
      };
      const response = await fetch(`/api/editMember/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(memberData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update member");
      }
      const result = await response.json();
      if (toast) {
        toast.show(result.message, "success", 5000);
      }
      setEditedMember('')
      setFormData(EditMemberDefaultFormValue);
      setErrors(EditMemberDefaultFormErrorValue);
      setDeleteOption(false);
    } catch (error: any) {
      if (toast) {
        toast.show(error.error || "Failed to update member", "error", 5000);
      } else {
        alert(error.error || "Failed to update member.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRecord = async () => {
    setDeleting(true);
    setShowPopup(false);
    try {
      const response = await fetch(`/api/editMember/${formData.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` 
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete member");
      }
      const result = await response.json();
      if (toast) {
        toast.show(result.message, "success", 5000);
      }
      setEditedMember('')
      setFormData(EditMemberDefaultFormValue);
      setErrors(EditMemberDefaultFormErrorValue);
      setDeleteOption(false);
      setDeleting(false);
    }
    catch (error: any) {    
      if (toast) {
        toast.show(error.error || "Failed to delete member", "error", 5000);
      } else {
        alert(error.error || "Failed to delete member.");
      }
    } finally {
      setShowPopup(false);
    }
  }

  const showWarning = (input: string) => {
      if (toast) {
          toast.show(`Can not change ${input} for this member`, "warning", 5000);
      }
  }

  // show and hide death details fields based on checkbox
  const showDeathDetails = formData.deceased ? "peer-checked:block" : "hidden";
  
  return (
    <div className="md:flex text-text_color relative">
      <Container className='relative'>
        {loading && <div className={`absolute inset-0 flex justify-center items-start bg-gray-50/30 z-10`}>
          <p className="mt-20 px-2 bg-field_color border border-border_color text-text_color rounded-md z-[100]">loading...</p>
        </div>}
        <div className="w-full md:max-w-xl p-4 mx-auto">
          <div className="mb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">                
                <Link href={"/add_edit"} className="md:hidden block">
                  <span><BackButton /></span>
                </Link>
                <p className="cursor-default text-2xl font-semibold text-text_color flex gap-2 flex-wrap">
                  <span>Edit</span>
                  <span className="underline">Member</span>
                  <span>/</span>
                  <span>Relationship</span>
                </p>
              </div>
              <div onClick={() => { setShowList(false); setShowPopup(true) }} className="cursor-pointer ml-4">
                <DeleteRecord />
              </div>
            </div>
          </div>
          <form className="text-text_color relative" onSubmit={handleSubmit}>
            {!formData.id  && <div onClick={() => setShowList(true)} className={`absolute inset-0 z-10`}></div>}
            <div className="w-full">
              <span className="text-sm font-medium" >Name</span>
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
            </div>
            <div className="flex gap-2 py-4">
                <p className="text-sm font-medium">Gender:</p>
                <RadioButton
                    label="Male"
                    name="gender"
                    // disabled = {formData.hasPartner || formData.isParent}
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={allowedEdit.editGender ? () => {showWarning('gender')} : handleInputChange}
                />
                <RadioButton
                    label="Female"
                    name="gender"
                    // disabled = {formData.hasPartner || formData.isParent}
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
                        min="1975"
                        max={new Date().getFullYear()}
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
                            min="1975"
                            max={new Date().getFullYear()}
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
              <Input
                  className="mb-2"
                  type="number"
                  name="phone_number"
                  label="Phone Number"
                  maxLength={14}
                  value={formData.phone_number || ''}
                  onChange={handleInputChange}
              />
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
                      name="siblings"
                      label="Siblings"
                      placeholder="Name1, Name2, ..."
                      value={formData.siblings || ''}
                      onChange={handleInputChange}
                  />
                </div>
              </div>}
              <ButtonSolid type="submit" className="w-full mt-8 mb-4" buttonText={submitting ? "Updateing..." : "Update Member"} />
            </form>
          <LinkButtonOutline buttonText="Cancel" linkto="/add_edit" className="hidden md:block" />
        </div>
      </Container>
      {showList && (
      <div
        onClick={() => setShowList(false)}
        className={`fixed md:hidden ${showList ? 'top-0 bg-gray-500/60' : 'bottom-full delay-300 bg-gray-300/5'} inset-0 z-[100] duration-500 ease-in-out`}
      /> )}
      <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background ${showList ? 'md:border-l md:border-border_color z-[100] rounded-t-md md:rounded-none -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full lg:max-w-lg mx-auto md:h-[calc(100vh-3rem)]`}>
        <div className={`overflow-x-hidden ${showList ? 'visible md:delay-300 transition-all ease-in-out' : 'invisible'}`}>
          <MemberList 
            forType={'selectMember'} 
            getSelectedValues={formData} 
            setSelectedValue={handleSelectedValue} 
            openList={setShowList} 
            multiselect={false}
            descendant={null} />
        </div>
      </div>
      {showPopup && 
        <Popup>
          {deleting && <div className="absolute inset-0 flex justify-center items-start bg-gray-50/30 z-10">
            <p className="mt-20 px-2 bg-field_color border border-border_color text-text_color rounded-md z-[100]">Deleting...</p>
          </div>}
          <p>Are you sure you want to delete this record?</p>
          <div className="flex justify-end mt-4 gap-4">
            <ButtonSolid buttonText="Delete" className="button-primary" onClick={deleteRecord} />
            <ButtonOutline buttonText="Cancel"  className="button-secondary" onClick={() => setShowPopup(false)} />
          </div>
        </Popup>}
    </div>
  );
}