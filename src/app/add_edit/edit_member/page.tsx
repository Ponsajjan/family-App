"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { ButtonSolid } from "@/components/Button";
import Input from "@/components/Input";
import RadioButton from "@/components/RadioButton";
import Checkbox from "@/components/CheckBox";
import MemberList from "@/components/MemberList";
import { EditMember } from "@/utils/Icons";

export default function Relatives() {
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
    father: "",
    mother: "",
    partner: "",
    children: "",
  });

  const [showListFor, setShowListFor] = useState("");
  const [showList, setShowList] = useState(false);
  const [errors, setErrors] = useState({ name: "", birth_date: "", birth_month: "", birth_year: "", death_year: "", death_month: "", death_date: "" });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowList(false)
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleShowList = (field: string) => {
    setShowListFor(field);
    setShowList(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {
      name: !formData.name ? "Name is required" : "",
      birth_date: formData.birth_date && !formData.birth_month ? "Date requires a month" : "",
      birth_month: formData.birth_month && !formData.birth_date ? "Month requires a date" : "",
      birth_year: formData.birth_year && (!formData.birth_month || !formData.birth_date) ? "Date and month are required" : "",

      death_month: formData.death_month && !formData.death_year ? "Month requires a year" : "",
      death_year: formData.death_year && !formData.death_month ? "Year requires a month" : "",
      death_date: formData.death_date && (!formData.death_month || !formData.death_year) ? "Month and year are required" : "",
    };

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return; // Exit early if there are validation errors
    }

    // Proceed with form submission
    console.log("Form submitted:", formData);

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
      father: "",
      mother: "",
      partner: "",
      children: "",
    });
  };


  return (
    <div className="md:flex text-text_color">
      <Container>
        <div className="w-full md:max-w-xl p-4 mx-auto">
          <div className="flex justify-start items-center mb-4">
            <Link href={"/add_edit"} className="block">
              <EditMember />
            </Link>
            <p className="text-2xl font-semibold text-center text-text_color underline pl-3">
              Edit Member
            </p>
          </div>
          <form className="text-text_color" onSubmit={handleSubmit}>
            <div
              onClick={() => handleShowList("selectUser")}
              className="w-full border p-2 bg-field_color border-border_color text-sm rounded-md mb-2 cursor-pointer"
            >
              {formData.name || <span className="text-gray-400">Select Member</span>}
            </div>
            <div className="flex gap-2 pt-2 pb-4">
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
                Date Of Birth <span className="font-normal opacity-45">(Optional)</span>
              </p>
              <div className="w-full mb-2 flex gap-2">
                <Input
                  onClick={() => setShowList(false)}
                  type="number"
                  placeholder="DD"
                  name="birth_date"
                  min="1"
                  max="31"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                />
                <Input
                  onClick={() => setShowList(false)}
                  type="number"
                  placeholder="MM"
                  name="birth_month"
                  min="1"
                  max="12"
                  value={formData.birth_month}
                  onChange={handleInputChange}
                />
                <Input
                  onClick={() => setShowList(false)}
                  type="number"
                  placeholder="YYYY(Opt)"
                  name="birth_year"
                  min="1975"
                  max={new Date().getFullYear()}
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
            <div className='relative py-2'>
                <p className="text-sm font-medium pr-2 inline-block">Deceased</p>
                <input type="checkbox" className="peer align-middle inline-block bg-main_background border border-border_active rounded-md" name="deceased" />

                <div className="hidden peer-checked:block pt-2">
                  <p className="text-sm font-medium">Date Of Death <span className='font-normal opacity-45'>(Optional)</span></p>
                  <p className='text-xs font-extralight absolute top-3 left-24'>(Remove checkmark if not Deceased)</p>
                  <div className="w-full flex gap-2">
                    <Input
                      onClick={() => setShowList(false)}
                      type="number"
                      placeholder="DD(Opt)"
                      name="death_date"
                      min="1"
                      max="31"
                      value={formData.death_date}
                      onChange={handleInputChange}
                    />
                    <Input
                      onClick={() => setShowList(false)}
                      type="number"
                      placeholder="MM"
                      name="death_month"
                      min="1"
                      max="12"
                      value={formData.death_month}
                      onChange={handleInputChange}
                    />
                    <Input
                      onClick={() => setShowList(false)}
                      type="number"
                      placeholder="YYYY"
                      name="death_year"
                      min="1975"
                      max={new Date().getFullYear()}
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
              onClick={() => setShowList(false)}
              className="mb-2"
              type="number"
              placeholder="Phone Number (Optional)"
              name="phone_number"
              label="Phone Number"
              value={formData.phone_number}
              onChange={handleInputChange}
            />
            <Input
              onClick={() => setShowList(false)}
              className="mb-2"
              label="Occupation"
              placeholder="Occupation (Optional)"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
            />
            <Input
              onClick={() => setShowList(false)}
              className="mb-2"
              label="Education"
              placeholder="Education (Optional)"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
            />
            <Input
              onClick={() => setShowList(false)}
              className="mb-2"
              label="Address"
              placeholder="Address (Optional)"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <div className="flex items-center gap-2 flex-wrap relative py-2">
                <p className="text-sm font-medium">Lalavillai Family</p>
                <input type="checkbox" className="peer bg-main_background border border-border_active rounded-md" name="deceased" />
                <div className="hidden peer-checked:flex w-full gap-2">
                  <div className='w-full'>
                    <p className="text-sm">Father</p>
                    <div
                      onClick={() => handleShowList("selectFather")}
                      className="w-full border p-2 bg-field_color border-border_color text-sm rounded-md cursor-pointer"
                    >
                    {formData.father || <span className="text-gray-400">Select Father</span>}
                    </div>
                  </div>
                  <div className="w-full">
                    <p className="text-sm">Mother</p>
                    <div
                      onClick={() => handleShowList("selectMother")}
                      className="w-full border p-2 bg-field_color border-border_color text-sm rounded-md cursor-pointer"
                    >
                    {formData.mother || <span className="text-gray-400">Select Mother</span>}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm">Partner</p>
            <div
              onClick={() => handleShowList("selectPartner")}
              className="w-full border p-2 bg-field_color border-border_color text-sm rounded-md mb-2 cursor-pointer"
            >
              {formData.partner || <span className="text-gray-400">Select Partner</span>}
            </div>
            <p className="text-sm">Children</p>
            <div
              onClick={() => handleShowList("selectChildren")}
              className="w-full border p-2 bg-field_color border-border_color text-sm rounded-md mb-8 cursor-pointer"
            >
              {formData.children || <span className="text-gray-400">Select Children</span>}
            </div>
            <ButtonSolid type="submit" className="w-full" buttonText="Update Member" />
          </form>
        </div>
      </Container>
      {showList && (
      <div
        onClick={() => setShowList(false)}
        className="fixed md:hidden inset-0 bg-gray-500 bg-opacity-75 z-[100]"
      /> )}
      <div className={`${showList ? 'md:border-l md:border-border_color md:static fixed left-0 right-0 bottom-0 z-[100] rounded-t-md' : 'md:w-0 h-0 opacity-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full lg:max-w-lg mx-auto bg-main_background overflow-y-auto`}>
        <MemberList forType={showListFor} />
      </div>
    </div>
  );
}
