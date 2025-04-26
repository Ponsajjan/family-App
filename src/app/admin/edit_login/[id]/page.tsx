"use client";

import { ButtonSolid, LinkButtonOutline } from '@/components/Button';
import Input from '@/components/Input';
import RadioButton from "@/components/RadioButton";
import { useEffect, useState } from 'react';
import Container from '@/components/Container';
import { validateNewLoginForm } from '@/utils/admin/new_login/validateNewLoginForm';
import { NewLoginDefaultErrorValue, NewLoginDefaultFormValue, NewLoginFormErrorTypes, NewLoginFormValueTypes } from '@/types/admin/new_login/types';
import { useToast } from '@/components/Toast';
import { useParams, useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

export default function Page() {
  const toast = useToast();
  const params = useParams();
  const router = useRouter();
  const token = getCookie('token');
  const memberId = params.id;

  const [validToken, setValidToken] = useState(true);
  const [formData, setFormData] = useState<NewLoginFormValueTypes>(NewLoginDefaultFormValue);
  const [errors, setErrors] = useState<NewLoginFormErrorTypes>(NewLoginDefaultErrorValue);

  // Fetch existing member data when the component mounts
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await fetch(`/api/admin/edit_login/${memberId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }}
        );
        const result = await response.json();
        const edit_member = result.data
        // Handle 401 Unauthorized
        if (response.status === 401) {
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          router.push('/login');
          return;
        }
        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch member data");
        }

        // Populate the form with the fetched data
        setFormData({
          id: edit_member.id,
          name: edit_member.name,
          gender: edit_member.gender,
          birth_date: edit_member.birth_date?.toString() || "",
          birth_month: edit_member.birth_month?.toString() || "",
          birth_year: edit_member.birth_year?.toString() || "",
          death_date: edit_member.death_date?.toString() || "",
          death_month: edit_member.death_month?.toString() || "",
          death_year: edit_member.death_year?.toString() || "",
          father: edit_member.father || "",
          mother: edit_member.mother || "",
          siblings: edit_member.siblings || "",
          phone_number: edit_member.phone_number || "",
          occupation: edit_member.occupation || "",
          education: edit_member.education || "",
          address: edit_member.address || "",
          member_password: edit_member.member_password,
          moderator_password: edit_member.moderator_password,
        });
      } catch (error) {
        console.error("Error fetching member data:", error);
        if (toast) {
          toast.show("Failed to fetch member data", "error", 5000);
        }
      }
    };

    if (memberId) {
      fetchMemberData();
    }
  }, [memberId, toast, router, token]);

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
      const updatedMemberDetails = {
        id: formData.id, // Include the member ID for the update
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
      };

      const response = await fetch(`/api/admin/edit_login/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(updatedMemberDetails),
      });

      // Handle API response
      const result = await response.json();
      if (!response.ok) {
        if (toast) {
          toast.show(result.error || "Something went wrong", "error", 5000);
        }
        throw new Error(result.error || "Something went wrong");
      }
      if (toast) {
        toast.show(result.message, "success", 5000);
      }     
    } catch (error) {
      console.error("Error submitting form:", error);
      if (toast) {
        toast.show("An error occurred. Please try again.", "error", 5000);
      } 
    } finally {
      router.push("/admin")
    }
  };

  if (validToken) {
    return (
      <Container>
        <div className='w-full max-w-3xl p-4 mx-auto'>
          <form className="text-text_color" onSubmit={handleSubmit}>
            <p className='text-lg'>Edit Descendant Details</p>
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
              label="Location State/Country"
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
            <ButtonSolid type="submit" className="w-full mt-8 mb-4" buttonText={"Update Credential"} />
            <LinkButtonOutline linkto='/admin' type="button" className="w-full" buttonText={"Cancel"} />
          </form>
        </div>
      </Container>
    );
  } else {
    return <p>Validating</p>;
  }
}