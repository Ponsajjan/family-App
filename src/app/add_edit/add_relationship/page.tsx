"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { ButtonSolid } from "@/components/Button";
import Input from "@/components/Input";
import RadioButton from "@/components/RadioButton";
import Checkbox from "@/components/CheckBox";
import MemberList from "@/components/MemberList";
import { AddRelationship, ChangeMember, CloseIcon, EditMember, MinusIcon, ResetData } from "@/utils/Icons";
import { useToast } from "@/components/Toast";

export default function EditMemberDetails () {
  const toast = useToast();
  const [memberName, setMemberName] = useState('');
  const [refreshList, setRefresh] = useState(true);
  interface Member {
    id: string;
    name: string;
  }
  interface DefaultValue {
    name: Member | null;
    gender: string | undefined;
    // father: Member | null;
    // mother: Member | null;
    partner: Member | null;
    children: Member[];
  }

  const defaultValue: DefaultValue = {
    name: null,
    gender: undefined,
    // father: null,
    // mother: null,
    partner: null,
    children: [],
  };
  // const [previousData, setPreviousData] = useState(defaultValue);
  const [prevformData, setPrevFormData] = useState(defaultValue);
  const [newformData, setNewFormData] = useState(defaultValue);
  // const noError = { 
  //   name: "",
  //   birth_date: "",
  //   birth_month: "",
  //   birth_year: "",
  //   death_year: "",
  //   death_month: "",
  //   death_date: "" 
  // }
  // const [errors, setErrors] = useState(noError);
  const [loading, setLoading] = useState(false)
  const [showListFor, setShowListFor] = useState('selectMember');
  const [showList, setShowList] = useState(false);
  
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setShowList(false)

  //   const { name, value, type, checked } = e.target;
  //   const id = formData.name?.id

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: name === "name" 
  //       ? { id:id, name: value }
  //       : type === "checkbox" 
  //       ? checked 
  //       : value,
  //   }));

  //   // Clear error when input is updated
  //   setErrors((prev) => ({ ...prev, [name]: "" })); 
  //   console.log('formdata', formData)
  // };

  // show and hide death details fields based on checkbox
//   const showDeathDetails = formData.deceased ? "peer-checked:block" : "hidden"; 

  const handleShowList = (field: string) => {
    setShowListFor(field);
    if (prevformData.name?.id) {
      setShowList(prev => !prev);
    } else {
      setShowList(true);
    }
  };

  useEffect(() => {
    if (prevformData.name?.id) {
      const fetchUser = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/editRelationship/${prevformData.name?.id}`);
          if (!response.ok) throw new Error('Failed to fetch user details');
      
          const { data } = await response.json();
          const dbData = data[0];
          console.log('dbDatadbDatadbData', dbData)

          // Determine children based on gender
          const childrenData = dbData.gender === 'Male' ? dbData.fatherOf : dbData.motherOf;

          const formatedDbData = {
            name:  {id: `${dbData.id}`, name: `${dbData.name}`},
            // father: {id: `${dbData.father?.id}`, name: `${dbData.father?.name}`},
            // mother: {id: `${dbData.mother?.id}`, name: `${dbData.mother?.name}`},
            gender: dbData.gender,
            partner: {id: `${dbData.partner?.id}`, name: `${dbData.partner?.name}`},
            children_id: childrenData ? childrenData.map((child: any) => child.id) : [],
            children: childrenData ? childrenData : [],
          }
          setPrevFormData(formatedDbData);
          setNewFormData(defaultValue)
          setMemberName(dbData.name)
          console.log('user', dbData)
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false)
        }
      }
  
      fetchUser()
    }
  }, [prevformData.name?.id])

  const handleCancelSelectedValue = (item: any, key:any, id: string) => {
    if (!key) return;
  
    setNewFormData((prev: any) => {
      if (Array.isArray(prev[key])) {
        // Check if the item already exists
        const exists = prev[key].some((entry: any) => entry.id === id);
  
        if (exists) {
          // Remove the existing entry
          return {
            ...prev,
            [key]: prev[key].filter((entry: any) => entry.id !== id),
          };
        } else {
          // Add the new entry
          return {
            ...prev,
            [key]: [...prev[key], { id, name: item }],
          };
        }
      }
  
      // If not an array, initialize with the first object
      return {
        ...prev,
        [key]: { id, name: item },
      };
    });
  };

  // Validate required fields
//   const validateForm = () => {
//     const errors: any = {};
  
//     if (!formData.name) errors.name = "Name is required";
//     if (formData.birth_date && !formData.birth_month) errors.birth_date = "Date of birth requires a month";
//     if (formData.birth_month && !formData.birth_date) errors.birth_month = "Date of birth requires a date";
//     if (formData.birth_year && (!formData.birth_month || !formData.birth_date)) 
//       errors.birth_year = "Date and month are required";
  
//     if (formData.deceased) {
//       if (formData.death_date && (!formData.death_month || !formData.death_year)) 
//         errors.death_date = "Month and year are required";
//       if (formData.death_month && !formData.death_year) errors.death_month = "Death anniversary requires a year";
//       if (formData.death_year && !formData.death_month) errors.death_year = "Death anniversary requires a month";
//     }
  
//     return errors;
//   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // const newErrors = validateForm();
    // if (Object.keys(newErrors).length > 0) {
    //   setErrors(newErrors);
    //   return;
    // }
  
    console.log("Form submitted:", prevformData);
  
    try {
      setLoading(true);
  
      const isMale = prevformData.gender === "Male";
      const isFemale = prevformData.gender === "Female";

      const memberData = {
        name: prevformData.name?.name,
        // fatherId: formData.father?.id ? parseInt(formData.father?.id, 10) : null,
        // motherId: formData.mother?.id ? parseInt(formData.mother?.id, 10) : null,
        partnerId: prevformData.partner?.id ? parseInt(prevformData.partner?.id, 10) : null,
        ...(isMale && {
          fatherOf: prevformData.children && prevformData.children.length > 0 ? prevformData.children.map((child: any) => child.id) : [],
        }),
        ...(isFemale && {
          motherOf: prevformData.children && prevformData.children.length > 0 ? prevformData.children.map((child: any) => child.id) : [],
        }),
      };

      console.log('memberData', memberData)
  
      const response = await fetch(`/api/editMember/${prevformData.name?.id}`, {
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
  
      setPrevFormData(defaultValue);
      setMemberName("");
      // setErrors(noError);
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
        {loading && <div className={`absolute inset-0 flex justify-center items-start bg-gray-50/30 z-10`}>
            <p className="mt-20 px-2 bg-field_color border border-border_color rounded-md z-[100]">loading...</p>
          </div>}
        <div className="w-full md:max-w-xl p-4 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Link href={"/add_edit"} className="block z-30">
                <AddRelationship />
              </Link>
              <p onClick={() => handleShowList('selectMember')} className="cursor-pointer text-2xl font-semibold text-center text-text_color underline pl-3">
                Add Relationship
              </p>
            </div>
          </div>
          <form className="text-text_color" onSubmit={handleSubmit}>
            <p className="text-sm">Member</p>
            <div 
              onClick={() => handleShowList('selectMember')} 
              className={`w-full flex justify-between items-center ${!prevformData.name || prevformData.name?.name == 'undefined' ? 'outline-2 outline-dashed outline-offset-2 outline-border_active' : ''} px-2 border bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer`} 
            >
              {prevformData.name && prevformData.name?.name !== 'undefined' ? 
                <>
                  <span className="py-2 w-full">{prevformData.name?.name}</span> 
                  <span><ChangeMember /></span>
                </> :
                <span className='py-2 w-full text-gray-400'>Select Member</span>}
            </div>

            <p className="text-sm">Partner</p>
            <div 
              onClick={() => {
                if (prevformData.partner && prevformData.partner?.name !== 'undefined') {
                  setShowList(false);
                } else {
                  handleShowList('selectPartner');
                }
              }
            }
              className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer" 
            >
              {(prevformData.partner && prevformData.partner?.name !== 'undefined')
                ? <span className="py-2 w-full">{prevformData.partner?.name}</span>
                : (newformData.partner && newformData.partner?.name !== 'undefined')
                  ? <>
                      <span className="py-2 w-full">{newformData.partner?.name}</span>
                      <span
                        onClick={() => console.log('hi')}
                        className="border border-border_color rounded-md h-fit">
                        <MinusIcon />
                      </span>
                    </>
                  : <span className='py-2 w-full text-gray-400'>Select Partner</span>}
            </div>

            

            {(prevformData.partner && prevformData.partner?.name !== 'undefined' || newformData.partner && newformData.partner?.name !== 'undefined') && 
            <div>
              {(prevformData.children.length > 0 || newformData.children.length > 0) && <p className="text-sm">Children</p>}
              <>
                {prevformData.children?.map((item: {id:any, name:string}, index:number) => (
                  <div onClick={() => setShowList(false)} key={index} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2 cursor-pointer" >
                    <span className="py-2 w-full">{item?.name}</span>
                  </div>)
                )}
              </>
              <>
                {newformData.children?.map((item: {id:any, name:string}, index:number) => (
                  <div onClick={() => handleShowList('selectChildren')} key={index} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2 cursor-pointer" >
                    <span className="py-2 w-full">{item?.name}</span>
                    <span
                      onClick={(e) => {e.stopPropagation(); handleCancelSelectedValue(item?.name, 'children', item?.id)}}
                      className="border border-border_color rounded-md h-fit">
                      <MinusIcon />
                    </span>
                  </div>)
                )}
              </>
            </div>}
            <p className="cursor-pointer text-sm text-text_color" onClick={() => handleShowList('selectChildren')}>Add Children +</p>

            <ButtonSolid type="submit" className="w-full mt-8" buttonText="Update Details" />
          </form>
        </div>
      </Container>
      <div
        onClick={() => setShowList(false)}
        className={`fixed md:hidden ${showList ? 'top-0 bg-gray-500/60' : 'bottom-full delay-300 bg-gray-300/5'} inset-0 z-[100] duration-500 ease-in-out`}
      />
      <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background overflow-x-hidden ${showList ? 'md:border-l md:border-border_color z-[100] rounded-t-md md:rounded-none -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full lg:max-w-lg mx-auto overflow-y-auto`}>
        <MemberList forType={showListFor} getSelectedValues={prevformData} setSelectedValue={showListFor == 'selectMember' ? setPrevFormData : setNewFormData} openList={setShowList} refreshList={refreshList} multiselect={'selectChildren' === showListFor}/>
      </div>
    </div>
  );
}
