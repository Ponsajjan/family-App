"use client";

import { ButtonSolid } from '@/components/Button';
import Input from '@/components/Input';
import RadioButton from "@/components/RadioButton";
import { useState } from 'react';
import Container from '@/components/Container';
import { validateNewLoginForm } from '@/utils/admin/new_login/validateNewLoginForm';
import { NewLoginDefaultErrorValue, NewLoginDefaultFormValue, NewLoginFormErrorTypes, NewLoginFormValueTypes } from '@/types/admin/types';
import { useToast } from '@/components/Toast';
import { useAuth } from '@/contexts/AuthContext';
import Topnav from '@/components/Topnav';

export default function Page() {
  const toast = useToast();
  const [formData, setFormData] = useState<NewLoginFormValueTypes>(NewLoginDefaultFormValue);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<NewLoginFormErrorTypes>(NewLoginDefaultErrorValue);
  const { logout } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "member_password" || name === "moderator_password") {
      setErrors((prev) => ({ ...prev, password: "" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorMessage = validateNewLoginForm(formData);
    if (Object.keys(errorMessage).length) {
      setErrors(errorMessage);
      return;
    }

    // Basic validation
    if (!formData.name || !formData.gender || !formData.member_password || !formData.moderator_password) {
      return;
    }

    try {
      setLoading(true);
      const newLoginDetails = {
        name: formData.name,
        gender: formData.gender,
        birthDate: formData.birth_date ? parseInt(formData.birth_date, 10) : null,
        birthMonth: formData.birth_month ? parseInt(formData.birth_month, 10) : null,
        birthYear: formData.birth_year ? parseInt(formData.birth_year, 10) : null,
        deathDate: formData.death_date ? parseInt(formData.death_date, 10) : null,
        deathMonth: formData.death_month ? parseInt(formData.death_month, 10) : null,
        deathYear: formData.death_year ? parseInt(formData.death_year, 10) : null,
        father: formData.father,
        mother: formData.mother,
        siblings: formData.siblings,
        phoneNumber: formData.phone_number,
        occupation: formData.occupation,
        education: formData.education,
        address: formData.address,
        memberPassword: formData.member_password,
        moderatorPassword: formData.moderator_password,
      }
      const response = await fetch('/api/admin/create_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLoginDetails),
      });
      const result = await response.json();

      // Handle 401 Unauthorized
      if (response.status === 401) {
        logout();
        return;
      }
      // Handle API response
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
        // throw allows the error to be caught and handled by any surrounding `try...catch` blocks or global error handlers
      }
      toast?.show(result.message, "success", 5000);
      setFormData(NewLoginDefaultFormValue);
    } catch (error: any) {
      toast?.show(error.message || "An error occurred. Please try again.", "error", 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Topnav />
      <Container>
        <div className='w-full max-w-3xl p-4 mx-auto'>
          <form className="text-text_color" onSubmit={handleSubmit}>
            <p className='text-lg'>For Descendents of</p>
            <Input
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              error={errors.name}
            />
            <div className="py-4">
              <div className="flex gap-2">
                <p className="text-sm font-medium">Gender:</p>
                <RadioButton
                  label="Male"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleInputChange}
                />
                <RadioButton
                  label="Female"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleInputChange}
                />
                {(errors.gender) && (
                  <p className="text-red-500 text-sm">
                    {errors.gender}
                  </p>
                )}
              </div>
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
                  value={formData.birth_date || ""}
                  onChange={handleInputChange}
                  min="1"
                  max="31"
                  maxLength={2}
                  label=""
                />
                <Input
                  type="number"
                  placeholder="MM"
                  name="birth_month"
                  value={formData.birth_month || ""}
                  onChange={handleInputChange}
                  min="1"
                  max="12"
                  maxLength={2}
                  label=""
                />
                <Input
                  type="number"
                  placeholder="YYYY(Opt)"
                  name="birth_year"
                  value={formData.birth_year || ""}
                  onChange={handleInputChange}
                  min="1600"
                  max={new Date().getFullYear()}
                  maxLength={4}
                  label=""
                />
              </div>
              {(errors.birth_day) && (
                <p className="text-red-500 text-sm">
                  {errors.birth_day}
                </p>
              )}
            </div>
            <div className='mb-2'>
              <p className="text-sm font-medium">
                Date Of Death<span className="font-normal opacity-45 pl-2">(Optional)</span>
              </p>
              <div className="w-full flex gap-2">
                <Input
                  type="number"
                  placeholder="DD(Opt)"
                  name="death_date"
                  value={formData.death_date || ""}
                  onChange={handleInputChange}
                  min="1"
                  max="31"
                  maxLength={2}
                  label=""
                />
                <Input
                  type="number"
                  placeholder="MM"
                  name="death_month"
                  value={formData.death_month || ""}
                  onChange={handleInputChange}
                  min="1"
                  max="12"
                  maxLength={2}
                  label=""
                />
                <Input
                  type="number"
                  placeholder="YYYY"
                  name="death_year"
                  value={formData.death_year || ""}
                  onChange={handleInputChange}
                  min="1600"
                  max={new Date().getFullYear()}
                  maxLength={4}
                  label=""
                />
              </div>
              {(errors.death_day) && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.death_day}
                </p>
              )}
            </div>
            <div className='flex gap-2'>
              <Input
                className="mb-2"
                showOptional={true}
                name="father"
                label="Father"
                value={formData.father}
                onChange={handleInputChange}
              />
              <Input
                className="mb-2"
                showOptional={true}
                name="mother"
                label="Mother"
                value={formData.mother}
                onChange={handleInputChange}
              />
            </div>
            <Input
              className="mb-2"
              showOptional={true}
              name="siblings"
              label="Siblings"
              value={formData.siblings}
              onChange={handleInputChange}
            />
            <div className='flex gap-2'>
              <Input
                className="mb-2"
                type="number"
                showOptional={true}
                name="phone_number"
                label="Contact"
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
            </div>
            <Input
              className="mb-2"
              showOptional={true}
              name="education"
              label="Education"
              value={formData.education}
              onChange={handleInputChange}
            />
            <Input
              className="mb-2"
              showOptional={true}
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <div className='flex gap-2'>
              <Input
                className="mb-2"
                name="member_password"
                label="Member Password"
                value={formData.member_password}
                onChange={handleInputChange}
              />
              <Input
                name="moderator_password"
                label="Moderator Password"
                value={formData.moderator_password}
                onChange={handleInputChange}
              />
            </div>
            {(errors.password) && (
              <p className="text-red-500 text-sm">
                {errors.password}
              </p>
            )}
            <ButtonSolid disabled={loading} type="submit" className="w-full mt-8 mb-4" buttonText={loading ? "Creating..." : "Create Credential"} />
          </form>
        </div>
      </Container>
    </>
  );
}
