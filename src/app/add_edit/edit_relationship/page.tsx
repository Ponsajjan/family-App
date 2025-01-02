"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { LinkButtonOutline } from "@/components/Button";
import MemberList from "@/components/MemberList";
import { AddRelationship, BackButton, ResetData } from "@/utils/Icons";
import { useToast } from "@/components/Toast";
import { useRouter } from 'next/navigation';
import { DeleteValueTypes, editRelationshipDefaultDeleteValue, editRelationshipDefaultFormValue, EditRelationshipValueTypes } from "@/types/add__edit/edit_relationship/types";
import EditRelationShipForm from "@/components/forms/EditRelationShipForm";

export default function EditMemberDetails () {
  const toast = useToast();
  const router = useRouter();
  const [noChanges, setNoChanges] = useState<boolean>(true);
  const [previousData, setPreviousData] = useState<EditRelationshipValueTypes>(editRelationshipDefaultFormValue);
  const [formData, setFormData] = useState<EditRelationshipValueTypes>(editRelationshipDefaultFormValue);
  const [deleteData, setDeleteData] = useState<DeleteValueTypes>(editRelationshipDefaultDeleteValue);
  const [loading, setLoading] = useState<boolean>(false);
  const [showList, setShowList] = useState<boolean>(false);

  const handleShowList = () => {
    setShowList(true)
  };

  useEffect(() => {
    if (formData.name) {
      const fetchUser = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/editRelationship/${formData.name}`);
          if (!response.ok) throw new Error('Failed to fetch user details');
          const { data } = await response.json();
          setFormData(data);
          setPreviousData(data)
        } catch (error:any) {
            if (toast) {
              toast.show(error.error || "Error fetching user details", "error", 5000)
            } else {
              console.error(error.error || 'Error fetching user details');
            }
            router.push('/add_edit');
        } finally {
            setLoading(false)
        }
      }
  
      fetchUser()
    }
  }, [formData.name])

  const handleRemoveChildrenValue = (id: number, name: string) => {
    setNoChanges(false);
    setFormData((prev: any) => {
      if (Array.isArray(prev['children'])) {
        // Check if the name already exists
        const exists = prev['children'].some((entry: any) => entry.id === id);
  
        if (exists) {
           // If the entry exists, remove it and add it to setDeleteData
          setDeleteData((prevDeleted: any) => ({
            ...prevDeleted,
            ['childrenId']: [...prevDeleted['childrenId'], id ],
          }));

          // Remove the existing entry
          return {
            ...prev,
            ['children']: prev['children'].filter((entry: any) => entry.id !== id),
          };
        } else {
          // Add the new entry
          return {
            ...prev,
            ['children']: [...prev['children'], { id, name: name }],
          };
        }
      }
  
      // If not an array, initialize with the first object
      return {
        ...prev,
        ['children']: { id, name: name },
      };
    });
  };

  const handleRemovePartnerValue = () => {
    setNoChanges(false)
    setDeleteData((prev: any) => ({
      ...prev,
      partnerId: previousData.partner?.id,
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
      partnerId: previousData.partner?.id,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (noChanges) {
      return
    }
  
    try {
      setLoading(true);
      const response = await fetch(`/api/editRelationship/${formData.id}`, {
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
  
      setFormData(editRelationshipDefaultFormValue);
      setDeleteData(editRelationshipDefaultDeleteValue);
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
          <EditRelationShipForm 
            handleShowList={handleShowList}
            handleRemovePartnerValue={handleRemovePartnerValue}
            handleDivorcePartner={handleDivorcePartner}
            handleRemoveChildrenValue={handleRemoveChildrenValue}
            handleSubmit={handleSubmit}
            formData={formData}
          />
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
