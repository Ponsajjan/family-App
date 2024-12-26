"use client";

import { useState } from "react";
import Link from "next/link";
import { AddMember, BackButton } from "@/utils/Icons";
import Container from "@/components/Container";
import { AddMemberDefaultFormValue, AddMemberDefaultErrorValue } from "@/types/add__edit/add_member/types";
import { handleSubmitAPI } from "@/utils/add_edit/add_members/handleSubmitAPI";
import { validateAddMemberForm } from "@/utils/add_edit/add_members/validateForm";
import { useToast } from "@/components/Toast";
import AddMemberForm from "@/components/forms/AddMemberForm";

export default function AddMemberDetails () {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(AddMemberDefaultFormValue);
  const [errors, setErrors] = useState(AddMemberDefaultErrorValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errorMessage = validateAddMemberForm(formData);  
    if (Object.keys(errorMessage).length) {
      setErrors(errorMessage);
      return;
    }
    try {
      setLoading(true);
      handleSubmitAPI(formData);
      if (toast) {
        toast.show("Member added successfully!", "success", 5000);
      }
      setFormData(AddMemberDefaultFormValue);
    } catch (error: any) {
      if (toast) {
        toast.show(error.message || "An unexpected error occurred.", "error", 5000);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="w-full md:max-w-xl p-4 mx-auto">
        <div className="flex justify-start items-center mb-3">
          <span className="hidden md:block"><AddMember /></span>
          <Link href={"/add_edit"} className="md:hidden block">
            <span><BackButton /></span>
          </Link>
          <p className="text-2xl font-semibold text-center text-text_color underline pl-3">
            Add Member
          </p>
        </div>
        <AddMemberForm
          formData={formData}
          loading={loading} 
          errors={errors}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
        />
      </div>
    </Container>
  );
}