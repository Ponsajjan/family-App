"use client";

import { useState } from "react";
import { ButtonSolid } from "@/components/Button";
import Input from "@/components/Input";
import RadioButton from "@/components/RadioButton";
import Link from "next/link";
import { AddMember } from "@/utils/Icons";
import { useToast } from '@/components/Toast';

export default function AddMemberDetails () {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    birth_date: "",
    birth_month: "",
    birth_year: "",
    deceased: false,
    death_date: "",
    death_month: "",
    death_year: "",
    phone_number: "",
    occupation: "",
    education: "",
    address: "",
  });

  const [errors, setErrors] = useState({ 
    name: "",
    birth_date: "",
    birth_month: "",
    birth_year: "",
    death_year: "",
    death_month: "",
    death_date: "" 
  });
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when input is updated
  };

  // show and hide death details fields based on checkbox
  const showDeathDetails = formData.deceased ? "peer-checked:block" : "hidden"; 

  // Validate required fields
  const validateForm = () => {
    const errors: any = {};
  
    if (!formData.name) errors.name = "Name is required";
    if (formData.birth_date && !formData.birth_month) errors.birth_date = "Date of birth requires a month";
    if (formData.birth_month && !formData.birth_date) errors.birth_month = "Date of birth requires a date";
    if (formData.birth_year && (!formData.birth_month || !formData.birth_date)) 
      errors.birth_year = "Date and month are required";
  
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
  
    // Validate the form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return; // Exit early if there are validation errors
    }
  
    try {
      setLoading(true);
  
      // Prepare member data
      const deceased = formData.deceased;
      const memberData = {
        name: formData.name,
        gender: formData.gender,
        birthDate: formData.birth_date ? parseInt(formData.birth_date, 10) : null,
        birthMonth: formData.birth_month ? parseInt(formData.birth_month, 10) : null,
        birthYear: formData.birth_year ? parseInt(formData.birth_year, 10) : null,
        deceased,
        deathDate: deceased && formData.death_date ? parseInt(formData.death_date, 10) : null,
        deathMonth: deceased && formData.death_month ? parseInt(formData.death_month, 10) : null,
        deathYear: deceased && formData.death_year ? parseInt(formData.death_year, 10) : null,
        phoneNumber: formData.phone_number,
        occupation: formData.occupation,
        education: formData.education,
        address: formData.address,
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
        throw new Error(result.error || "Something went wrong");
      }
  
      // Success: Show toast and reset form
      if (toast) {
        toast.show("Member added successfully!", "success", 5000);
      }
  
      // Reset form
      setFormData({
        name: "",
        gender: "Male",
        birth_date: "",
        birth_month: "",
        birth_year: "",
        deceased: false,
        death_date: "",
        death_month: "",
        death_year: "",
        phone_number: "",
        occupation: "",
        education: "",
        address: "",
      });
    } catch (error: any) {
      console.error("Error adding user:", error);
  
      // Show toast for error
      if (toast) {
        toast.show(error.message || "An unexpected error occurred.", "error", 5000);
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="w-full md:max-w-xl p-4 mx-auto">
      <div className="flex justify-start items-center mb-4">
        <Link href={"/add_edit"} className="block">
          <AddMember />
        </Link>
        <p className="text-2xl font-semibold text-center text-text_color underline pl-3">
          Add Member
        </p>
      </div>
      <form className="text-text_color" onSubmit={handleSubmit}>
        <Input
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
        />
        <div className="flex gap-2 py-4">
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
              maxLength="2"
              label=""
              value={formData.birth_date}
              onChange={handleInputChange}
            />
            <Input
              type="number"
              placeholder="MM"
              name="birth_month"
              min="1"
              max="12"
              maxLength="2"
              label=""
              value={formData.birth_month}
              onChange={handleInputChange}
            />
            <Input
              type="number"
              placeholder="YYYY(Opt)"
              name="birth_year"
              min="1975"
              max={new Date().getFullYear()}
              maxLength="4"
              label=""
              value={formData.birth_year}
              onChange={handleInputChange}
            />
          </div>
          {(errors.birth_date || errors.birth_month || errors.birth_year) && (
            <p className="text-red-500 text-sm">
              {errors.birth_date || errors.birth_month || errors.birth_year}
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
              checked={formData.deceased}
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
                maxLength="2"
                label=""
                value={formData.death_date}
                onChange={handleInputChange}
              />
              <Input
                type="number"
                placeholder="MM"
                name="death_month"
                min="1"
                max="12"
                maxLength="2"
                label=""
                value={formData.death_month}
                onChange={handleInputChange}
              />
              <Input
                type="number"
                placeholder="YYYY"
                name="death_year"
                min="1975"
                max={new Date().getFullYear()}
                maxLength="4"
                label=""
                value={formData.death_year}
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
          className="mb-2"
          type="number"
          showOptional={true}
          name="phone_number"
          label="Phone Number"
          value={formData.phone_number}
          onChange={handleInputChange}
        />
        <Input
          className="mb-2"
          showOptional={true}
          name="occupation"
          label="Occupation"
          value={formData.occupation}
          onChange={handleInputChange}
        />
        <Input
          className="mb-2"
          showOptional={true}
          name="education"
          label="Education"
          value={formData.education}
          onChange={handleInputChange}
        />
        <Input
          className="mb-8"
          showOptional={true}
          name="address"
          label="Address"
          value={formData.address}
          onChange={handleInputChange}
        />

        <ButtonSolid type="submit" disabled={loading} className="w-full mb-4" buttonText={loading ? "Adding..." : "Add Member"} />
      </form>
    </div>
  );
}
