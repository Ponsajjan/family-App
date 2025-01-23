"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { LinkButtonOutline } from "@/components/Button";
import MemberList from "@/components/MemberList";
import { BackButton, DeleteRecord, EditMember } from "@/utils/Icons";
import { useToast } from "@/components/Toast";
import { AllowedEditTypes, DefaultAllowedEdits, EditMemberDefaultFormErrorValue, EditMemberDefaultFormValue, EditMemberFormErrorTypes, EditMemberFormValueTypes } from "@/types/add__edit/edit_member/types";
import EditMemberForm from "@/components/forms/EditMemberForm";
import { validateEditMemberForm } from "@/utils/add_edit/edit_members/validateEditMemberForm";

export default function EditMemberDetails () {
  const toast = useToast();
  const [showList, setShowList] = useState(false);
  const [editedMember, setEditedMember] = useState('')
  const [formData, setFormData] = useState<EditMemberFormValueTypes>(EditMemberDefaultFormValue);
  const [allowedEdit, setAllowedEdit] = useState<AllowedEditTypes>(DefaultAllowedEdits);
  const [errors, setErrors] = useState<EditMemberFormErrorTypes>(EditMemberDefaultFormErrorValue);
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false);
  
  const handleSelectedValue = (name: string, id: number) => {
    setFormData((prev) => ({ ...prev, name, id }));
    setShowList(false);
  };
  
  useEffect(() => {
    if (formData.id) {
      const fetchMember = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/editMember/${formData.id}`);
          if (!response.ok) throw new Error('Failed to fetch member details');
          const { data } = await response.json();
          setEditedMember(data.formData.name)
          setFormData(data.formData);
          setAllowedEdit(data.allowEdit)
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
  }, [formData.id]);

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
  
  return (
    <div className="md:flex text-text_color">
      <Container className='relative'>
        {loading && <div className={`absolute inset-0 flex justify-center items-start bg-gray-50/30 z-10`}>
            <p className="mt-20 px-2 bg-field_color border border-border_color text-text_color rounded-md z-[100]">loading...</p>
          </div>}
        <div className="w-full md:max-w-xl p-4 mx-auto">
          <div className="mb-3">
            <div className="flex items-center">
              <span className="hidden md:block"><EditMember /></span>
              <Link href={"/add_edit"} className="md:hidden block">
                <span><BackButton /></span>
              </Link>
              <p className="cursor-default text-2xl font-semibold text-text_color underline pl-3">
                Edit {editedMember ? editedMember  :'Member'}
              </p>
              {formData.name && <div className="cursor-pointer ml-4">
                <DeleteRecord />
              </div>}
            </div>
          </div>
          <EditMemberForm 
            handleSubmit={handleSubmit}
            formData={formData}
            setShowList={setShowList}
            handleInputChange={handleInputChange}
            errors={errors}
            allowedEdit={allowedEdit}
            submitting={submitting}
          />
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
    </div>
  );
}