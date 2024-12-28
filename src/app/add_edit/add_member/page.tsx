"use client";

import { useState } from "react";
import Link from "next/link";
import { AddMember, BackButton } from "@/utils/Icons";
import Container from "@/components/Container";
import { AddMemberDefaultFormValue, AddMemberDefaultErrorValue } from "@/types/add__edit/add_member/types";
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMessage = validateAddMemberForm(formData);  
    if (Object.keys(errorMessage).length) {
      setErrors(errorMessage);
      return;
    }
    try {
      setLoading(true);
      const deceased = formData.deceased;
      const descendant = formData.descendant === "Yes";
      const memberData = {
        name: formData.name,
        gender: formData.gender,
        birthDate: formData.birth_date ? parseInt(formData.birth_date, 10) : null,
        birthMonth: formData.birth_month ? parseInt(formData.birth_month, 10) : null,
        birthYear: formData.birth_year ? parseInt(formData.birth_year, 10) : null,
        deceased: formData.deceased,
        deathDate: deceased && formData.death_date ? parseInt(formData.death_date, 10) : null,
        deathMonth: deceased && formData.death_month ? parseInt(formData.death_month, 10) : null,
        deathYear: deceased && formData.death_year ? parseInt(formData.death_year, 10) : null,
        phoneNumber: formData.phone_number,
        occupation: formData.occupation,
        education: formData.education,
        address: formData.address,
        descendant: descendant,
        father: descendant ? null : formData.father,
        mother: descendant ? null : formData.mother,
        siblings: descendant ? null : formData.siblings
      };
    
      // API Call
      const response = await fetch("/api/addMember", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });
    
      // Handle API response
      const result = await response.json();
      if (!response.ok) {
        if (toast) {
          toast.show(result.error || "Something went wrong", "error", 5000);
        }
        throw new Error(result.error || "Something went wrong");
        // throw allows the error to be caught and handled by any surrounding `try...catch` blocks or global error handlers
      } else {
        if (toast) {
          toast.show(result.message, "success", 5000);
        }
      }

      setFormData(AddMemberDefaultFormValue);
    } catch (error: any) {
      if (toast) {
        toast.show(error.error || "An unexpected error occurred.", "error", 5000);
      }
      throw new Error(error.error || "Something went wrong");
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