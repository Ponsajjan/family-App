"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { ButtonSolid } from "@/components/Button";
import Input from "@/components/Input";
import RadioButton from "@/components/RadioButton";
import Checkbox from "@/components/CheckBox";
import MemberList from "@/components/MemberList";
import { CloseIcon, EditMember, ResetData } from "@/utils/Icons";
import { useToast } from "@/components/Toast";

export default function Relatives() {
  const toast = useToast();
  const [memberName, setMemberName] = useState('');
  const [refreshList, setRefresh] = useState(true);
  const defaultValue = {
      name_id: '',
      name: '',
      gender: "Male",
      birth_date: null,
      birth_month: null,
      birth_year: null,
      deceased: false,
      death_date: null,
      death_month: null,
      death_year: null,
      phone_number: '',
      occupation: '',
      education: '',
      address: '',
      descendant: false,
      father_id: null,
      father: '',
      mother_id: null,
      mother: '',
      partner_id: null,
      partner: '',
      children_id: [],
      children: [],
  }
  const [previousData, setPreviousData] = useState(defaultValue);
  const [formData, setFormData] = useState(defaultValue);
  const noError = { 
    name: "",
    birth_date: "",
    birth_month: "",
    birth_year: "",
    death_year: "",
    death_month: "",
    death_date: "" 
  }
  const [errors, setErrors] = useState(noError);
  const [loading, setLoading] = useState(false)
  const [showListFor, setShowListFor] = useState('selectMember');
  const [showList, setShowList] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowList(false)
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when input is updated
    console.log('formdata', formData)
  };

  // show and hide death details fields based on checkbox
  const showDeathDetails = formData.deceased ? "peer-checked:block" : "hidden"; 

  const handleShowList = (field: string) => {
    setShowListFor(field);
    setShowList(true);
  };

  useEffect(() => {
    if (formData.name_id) {
      const fetchUser = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/editMember/${formData.name_id}`);
          if (!response.ok) throw new Error('Failed to fetch user details');
      
          const { data } = await response.json();
          const dbData = data[0];
          console.log('dbDatadbDatadbData', dbData)

          // Determine children based on gender
          const childrenData = dbData.gender === 'Male' ? dbData.fatherOf : dbData.motherOf;

          const formatedDbData = {
            name_id: dbData.id || null,
            name:  dbData.name,
            gender:  dbData.gender,
            birth_date:  dbData.birthDate || null,
            birth_month:  dbData.birthMonth || null,
            birth_year:  dbData.birthYear || null,
            deceased: dbData.deceased,
            death_date:  dbData.deathDate || null,
            death_month:  dbData.deathMonth || null,
            death_year:  dbData.deathYear || null,
            phone_number:  dbData.phoneNumber,
            occupation:  dbData.occupation,
            education:  dbData.education,
            address:  dbData.address,
            descendant: dbData.descendant,
            father_id: dbData.father?.id || null,
            father: dbData.father?.name || null,
            mother_id: dbData.mother?.id || null,
            mother: dbData.mother?.name || null,
            partner_id: dbData.partner?.id || null,
            partner: dbData.partner?.name || null,
            children_id: childrenData ? childrenData.map((child: any) => child.id) : [],
            children: childrenData ? childrenData.map((child: any) => child.name) : [],
          }
          setFormData(formatedDbData);
          setMemberName(dbData.name)
          setPreviousData(formatedDbData)
          console.log('user', dbData)
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false)
        }
      }
  
      fetchUser()
    }
  }, [formData.name_id])


  const handleCancelSelectedValue = (item: any, key:any) => {
    if (!key) return;
  
    setFormData((prev: any) => {
      if (Array.isArray(prev[key])) {
        // For array keys: Add or remove the value
        const updatedArray = prev[key].includes(item)
          ? prev[key].filter((val: any) => val !== item) // Remove if it exists
          : [...prev[key], item]; // Add if it doesn't exist
  
        return { ...prev, [key]: updatedArray };
      }
    });
  };

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
  
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    console.log("Form submitted:", formData);
  
    try {
      setLoading(true);
  
      const deceased = formData.deceased;
      const isMale = formData.gender === "Male";
      const isFemale = formData.gender === "Female";

      const memberData = {
        name: formData.name,
        gender: formData.gender,
        birthDate: formData.birth_date ? parseInt(formData.birth_date, 10) : null,
        birthMonth: formData.birth_month ? parseInt(formData.birth_month, 10) : null,
        birthYear: formData.birth_year ? parseInt(formData.birth_year, 10) : null,
        deceased: deceased,
        deathDate: deceased && formData.death_date ? parseInt(formData.death_date, 10) : null,
        deathMonth: deceased && formData.death_month ? parseInt(formData.death_month, 10) : null,
        deathYear: deceased && formData.death_year ? parseInt(formData.death_year, 10) : null,
        phoneNumber: formData.phone_number,
        occupation: formData.occupation,
        education: formData.education,
        address: formData.address,
        fatherId: formData.father_id ? parseInt(formData.father_id, 10) : null,
        motherId: formData.mother_id ? parseInt(formData.mother_id, 10) : null,
        partnerId: formData.partner_id ? parseInt(formData.partner_id, 10) : null,
        ...(isMale && {
          fatherOf: formData.children_id && formData.children_id.length > 0 ? formData.children_id : [],
        }),
        ...(isFemale && {
          motherOf: formData.children_id && formData.children_id.length > 0 ? formData.children_id : [],
        }),
      };
  
      const response = await fetch(`/api/editMember/${formData.name_id}`, {
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
  
      setFormData(defaultValue);
      setMemberName("");
      setErrors(noError);
      setRefresh((prev) => !prev);
    } catch (error: any) {
      console.error("Error updating member:", error);
  
      if (toast) {
        toast.show(error.message || "Failed to update member", "error", 5000);
      } else {
        alert(error.message || "Failed to update member.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="md:flex text-text_color">
      <Container className='relative'>
        {!memberName && <div onClick={() => handleShowList('selectMember')} className={`fixed inset-0 z-10`}></div>}
        {loading && <div className={`fixed inset-0 flex justify-center items-start bg-gray-50/30 z-10`}>
            <p className="mt-20 px-2 bg-field_color border border-border_color rounded-md z-[100]">loading...</p>
          </div>}
        <div className="w-full md:max-w-xl p-4 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Link href={"/add_edit"} className="block z-30">
                <EditMember />
              </Link>
              <p onClick={() => handleShowList('selectMember')} className="cursor-pointer text-2xl font-semibold text-center text-text_color underline pl-3">
                Edit {memberName ? memberName :'Member'}
              </p>
            </div>
            <div onClick={() => {setFormData(previousData); setErrors(noError);}}><ResetData /></div>
          </div>
          <form className="text-text_color" onSubmit={handleSubmit}>
            {/* <div
              onClick={handleSelectMember}
              className="w-full border p-2 bg-field_color border-border_color text-sm rounded-md mb-2 cursor-pointer"
            >
              {formData.name || <span className="text-gray-400">Select Member</span>}
            </div> */}
            <Input
              onClick={() => setShowList(false)}
              className={`${memberName ? '' : 'outline-2 outline-offset-2 outline-border_active'}`}
              type="text"
              placeholder="Name"
              name="name"
              label="Name"
              value={formData.name || ''}
              error={errors.name}
              onChange={handleInputChange}
            />
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
                <p className="text-sm font-medium pr-2 inline-block">Deceased</p>
                <input
                  type="checkbox"
                  className="peer align-middle inline-block bg-main_background border border-border_active rounded-md"
                  name="deceased"
                  checked={formData.deceased}
                  onChange={handleInputChange}
                />
                <div className={`${showDeathDetails} pt-2`}>
                  <p className="text-sm font-medium">Date Of Death <span className='font-normal opacity-45'>(Optional)</span></p>
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
              placeholder="Phone Number (Optional)"
              name="phone_number"
              label="Phone Number"
              value={formData.phone_number || ''}
              onChange={handleInputChange}
            />
            <Input
              onClick={() => setShowList(false)}
              className="mb-2"
              label="Occupation"
              placeholder="Occupation (Optional)"
              name="occupation"
              value={formData.occupation || ''}
              onChange={handleInputChange}
            />
            <Input
              onClick={() => setShowList(false)}
              className="mb-2"
              label="Education"
              placeholder="Education (Optional)"
              name="education"
              value={formData.education || ''}
              onChange={handleInputChange}
            />
            <Input
              onClick={() => setShowList(false)}
              className="mb-2"
              label="Address"
              placeholder="Address (Optional)"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
            />
            <div className="flex items-center gap-2 flex-wrap relative py-2">
                <p className="text-sm font-medium">Lalavillai Family</p>              
                <input 
                  type="checkbox" 
                  className="peer bg-main_background border border-border_active rounded-md" 
                  name="descendant" 
                  checked={formData.descendant}
                  onChange={handleInputChange} 
                />
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
              onClick={() => handleShowList('selectPartner')} 
              className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer" 
            >
              {formData.partner ? 
                <>
                  <span className="py-2 w-full">{formData.partner}</span>
                  {/* <span
                    onClick={() => handleCancelSelectedValue(formData.partner, 'partner')}
                    className="border border-border_color rounded-md h-fit">
                    <CloseIcon />
                  </span> */}
                </> : 
                <span className='py-2 w-full text-gray-400'>Partner</span>}
            </div>
            <p className="text-sm">Children</p>
            <div className='mb-8' >
              {formData.children.length <= 0 ? (
                <div onClick={() => handleShowList('selectChildren')} className="w-full border p-2 bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer" >
                  <span className='text-gray-400'>Children</span>
                </div>) :
                formData.children.map((selected:any, index:number) => (
                  <div key={index} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer" >
                    <span onClick={() => handleShowList('selectChildren')} className="py-2 w-full">{selected}</span>
                    <span
                      onClick={() => handleCancelSelectedValue(selected, 'children')}
                      className="border border-border_color rounded-md h-fit">
                      <CloseIcon />
                    </span>
                  </div>)
                )
              }
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
      <div className={`${showList ? 'md:border-l md:border-border_color md:static fixed left-0 right-0 bottom-0 z-[100] rounded-t-md' : 'md:w-0 h-0 opacity-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full lg:max-w-lg mx-auto overflow-y-auto`}>
        <MemberList forType={showListFor} getSelectedValues={formData} setSelectedValue={setFormData} openList={setShowList} refreshList={refreshList} />
      </div>
    </div>
  );
}
