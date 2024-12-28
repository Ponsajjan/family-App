"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { ButtonSolid, LinkButtonOutline } from "@/components/Button";
import MemberList from "@/components/MemberList";
import { AddRelationship, BackButton, ChangeMember, CloseIcon, Divorced, EditMember, ResetData } from "@/utils/Icons";
import { useToast } from "@/components/Toast";
import { useRouter } from 'next/navigation';

export default function EditMemberDetails () {
  const toast = useToast();
  const router = useRouter();
  const [memberName, setMemberName] = useState('');
  const [refreshList, setRefresh] = useState(true);
  const [noChanges, setNoChanges] = useState(true);
  interface Member {
    id: string;
    name: string;
  }
  interface DefaultValue {
    name: Member | null;
    gender: string | undefined;
    partner: Member | null;
    children: Member[];
  }

  interface DefaultDelete {
    partnerId: Member | null;
    childrenId: any[];
  }

  const defaultValue: DefaultValue = {
    name: null,
    gender: undefined,
    partner: null,
    children: [],
  };

  const defaultDelete: DefaultDelete = {
    partnerId: null,
    childrenId: [],
  };

  const [previousData, setPreviousData] = useState(defaultValue);
  const [formData, setFormData] = useState(defaultValue);
  const [deleteData, setDeleteData] = useState(defaultDelete);

  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);

  const handleShowList = () => {
    setShowList(true)
  };

  useEffect(() => {
    if (formData.name?.id) {
      const fetchUser = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/editRelationship/${formData.name?.id}`);
          if (!response.ok) throw new Error('Failed to fetch user details');
      
          const { data } = await response.json();
          const dbData = data[0];
          // console.log('dbDatadbDatadbData', dbData)

          // Determine children based on gender
          const childrenData = dbData.gender === 'Male' ? dbData.fatherOf : dbData.motherOf;

          const formatedDbData = {
            name:  {id: `${dbData.id}`, name: `${dbData.name}`},
            // father: {id: `${dbData.father?.id}`, name: `${dbData.father?.name}`},
            // mother: {id: `${dbData.mother?.id}`, name: `${dbData.mother?.name}`},
            gender: dbData.gender,
            partner: {id: `${dbData.partner?.id}`, name: `${dbData.partner?.name}`},
            // children_id: childrenData ? childrenData.map((child: any) => child.id) : [],
            children: childrenData ? childrenData : [],
          }
          setFormData(formatedDbData);
          setMemberName(dbData.name)
          setPreviousData(formatedDbData)
          // console.log('user', dbData)
        } catch (error:any) {
            if (toast) {
              toast.show(error.message || "Error fetching user details", "error", 5000)
            } else {
              alert(error.message || 'Error fetching user details');
            }
            router.push('/add_edit');
        } finally {
            setLoading(false)
        }
      }
  
      fetchUser()
    }
  }, [formData.name?.id])

  const handleRemoveChildrenValue = (item: any, key:any, id: string) => {
    if (!key) return;
    setNoChanges(false);
    setFormData((prev: any) => {
      if (Array.isArray(prev[key])) {
        // Check if the item already exists
        const exists = prev[key].some((entry: any) => entry.id === id);
  
        if (exists) {
           // If the entry exists, remove it and add it to setDeleteData
          setDeleteData((prevDeleted: any) => ({
            ...prevDeleted,
            ['childrenId']: [...prevDeleted['childrenId'], id ],
          }));

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

  const handleRemovePartnerValue = () => {
    setNoChanges(false)
    setDeleteData((prev: any) => ({
      ...prev,
      partnerId: parseInt(previousData.partner?.id || ''),
      childrenId: previousData.children?.map((child: any) => child.id) || [],
    }));
    setFormData((prev: any) => ({
      ...prev,
      partner: null,
      children: [],
    }))
  }

  const handleDivorcePartner = () => {
    setNoChanges(false)
    setDeleteData((prev: any) => ({
      ...prev,
      partnerId: parseInt(previousData.partner?.id || ''),
    }));
    setFormData((prev: any) => ({
      ...prev,
      partner: null,
    }))
  }

  const handleSelectedValue = (item: any, id: string) => {
    setFormData((prev: any) => ({...prev, ['name']: { id, name: item }}));
    setShowList(false)
  };

  console.log("Form deleteData:", deleteData);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (noChanges) {
      return
    }
  
    try {
      setLoading(true);
  
      const response = await fetch(`/api/editRelationship/${formData.name?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (toast) {
          toast.show(errorData.error || "Failed to update member", "error", 5000)
        } else {
          alert(errorData.error || "Failed to update member")
        }
        // throw new Error(errorData.error || "Failed to update member");
      }
  
      const result = await response.json();
      console.log("Member updated successfully:", result);
  
      if (toast) {
        toast.show("Member updated successfully", "success", 5000);
      }
  
      setFormData(defaultValue);
      setMemberName("");
      setRefresh((prev) => !prev);
      setNoChanges(true)
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
        {loading && <div className={`absolute inset-0 flex justify-center items-start bg-gray-50/30 z-10`}>
          <p className="mt-20 px-2 bg-field_color border border-border_color rounded-md z-[100]">loading...</p>
        </div>}
        <div className="w-full md:max-w-xl p-4 mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <span className="hidden md:block"><AddRelationship /></span>
              <Link href={"/add_edit"} className="md:hidden block">
                <span><BackButton /></span>
              </Link>
              <p className="text-2xl font-semibold text-center text-text_color underline pl-3">
                Edit Relationship
              </p>
            </div>
            <div className="cursor-pointer" onClick={() => setFormData(previousData)}><ResetData /></div>
          </div>
          <form className="text-text_color relative" onSubmit={handleSubmit}>
            {!memberName && <div onClick={() => handleShowList()} className={`absolute inset-0 z-10`}></div>}
            <p className="text-sm">Member</p>
            <div 
              onClick={() => handleShowList()} 
              className={`w-full flex justify-between ${!formData.name || formData.name?.name == 'undefined' ? 'outline-2 outline-dashed outline-offset-2 outline-border_active' : ''} items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2 cursor-pointer`} 
            >
              {formData.name && formData.name?.name !== 'undefined' ? 
                <>
                  <span className="py-2 w-full">{formData.name?.name}</span> 
                  <span><ChangeMember /></span>
                </> :
                <span className='py-2 w-full text-gray-400'>Select Member</span>}
            </div>





            {!formData.name || formData.name?.name === 'undefined' ? 
              <>
                <p className="text-sm">Partner</p>
                <div className="w-full px-2 border bg-field_color border-border_color text-sm rounded-md mb-2 cursor-pointer" >
                  <span className='block py-2 w-full text-gray-400'>Select Partner</span> 
                </div>
              </> :
              formData.partner && formData.partner?.name !== 'undefined' ? 
              <>
                <p className="text-sm">Partner</p>
                <div className="w-full flex justify-between items-center pl-2 pr-[3px] border bg-field_color border-border_color text-sm rounded-md mb-2" >
                  <span className="py-2 w-full">{formData.partner?.name}</span>
                  <div className="flex gap-2 items-center border border-border_color px-2 py-0.5 rounded-md">
                    <span 
                      onClick={() => handleDivorcePartner()}
                      className="block border-r border-border_color w-9 h-6 pr-3 cursor-pointer">
                      <Divorced />
                    </span>
                    <span
                      onClick={() => handleRemovePartnerValue()}
                      className="block h-fit cursor-pointer">
                      <CloseIcon />
                    </span>
                  </div>
                </div>
              </>: 
              <></>
            }










            {formData.children.length > 0 && 
            <>
              <p className="text-sm">Children</p>
              {formData.children?.map((item: {id:any, name:string}, index:number) => (
                <div key={index} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2" >
                  <span className="py-2 w-full">{item?.name}</span>
                  {formData.children.length > 0 && <span
                    onClick={() => handleRemoveChildrenValue(item?.name, 'children', item?.id)}
                    className="border border-border_color rounded-md h-fit  cursor-pointer">
                    <CloseIcon />
                  </span>}
                </div>)
              )}
            </>}
            <ButtonSolid type="submit" className="w-full mt-8 mb-4" buttonText="Update Details" />
          </form>
          <LinkButtonOutline buttonText="Cancel" linkto="/add_edit" className="hidden md:block" />
        </div>
      </Container>
      <div
        onClick={() => setShowList(false)}
        className={`fixed md:hidden ${showList ? 'top-0 bg-gray-500/60' : 'bottom-full delay-300 bg-gray-300/5'} inset-0 z-[100] duration-500 ease-in-out`}
      />
      <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background overflow-x-hidden ${showList ? 'md:border-l md:border-border_color z-[100] rounded-t-md md:rounded-none -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full lg:max-w-lg mx-auto overflow-y-auto`}>
        <MemberList forType={'editRelationship'} getSelectedValues={formData} setSelectedValue={handleSelectedValue} openList={setShowList} multiselect={false} descendant={null} />
      </div>
    </div>
  );
}
