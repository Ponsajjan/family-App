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
import EditRelationShipForm from "@/components/forms/EditRelationForm";
import { getCookie } from 'cookies-next';

export default function ModeratorEditRelationship() {
  const toast = useToast();
  const [noChanges, setNoChanges] = useState<boolean>(true);
  const [previousData, setPreviousData] = useState<EditRelationshipValueTypes>(editRelationshipDefaultFormValue);
  const [formData, setFormData] = useState<EditRelationshipValueTypes>(editRelationshipDefaultFormValue);
  const [deleteData, setDeleteData] = useState<DeleteValueTypes>(editRelationshipDefaultDeleteValue);
  const [hasPartner, setHasPatner] = useState<number | undefined | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showList, setShowList] = useState<boolean>(false);
  const token = getCookie('token');
  const router = useRouter(); 

  const handleShowList = () => {
    setShowList(true);
  };

  useEffect(() => {
    if (formData.id) {
      const fetchMembers = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/moderator/editRelationship/${formData.id}`,
            {
              method: 'GET',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              },
            }
          );
          // Handle 401 Unauthorized
          if (response.status === 401) {
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            router.push('/login');
            return;
          }
          if (!response.ok) throw new Error('Failed to fetch member details');
          const { data } = await response.json();

          // Ensure children are sorted by order
          if (data.children && Array.isArray(data.children)) {
            data.children.sort((a: any, b: any) => a.order - b.order);
          }

          setFormData(data);
          setHasPatner(data.partner?.id);
          setPreviousData(data);
        } catch (error: any) {
          if (toast) {
            toast.show(error.error || "Error fetching member details", "error", 5000);
          } else {
            console.error(error.error || 'Error fetching member details');
          }
          router.push('/add_edit');
        } finally {
          setLoading(false);
        }
      };

      fetchMembers();
    }
  }, [formData.id, toast, router, token]);

  const handleRemoveChildrenValue = (id: number) => {
    setNoChanges(false);
    setFormData((prev: any) => {
      if (Array.isArray(prev['children'])) {
        // Check if the name already exists
        const exists = prev['children'].some((entry: any) => entry.id === id);
        if (exists) {
          // If the entry exists, remove it and add it to setDeleteData
          setDeleteData((prevDeleted: any) => ({
            ...prevDeleted,
            ['childrenId']: [...prevDeleted['childrenId'], id],
          }));
          // Remove the existing entry
          return {
            ...prev,
            ['children']: prev['children'].filter((entry: any) => entry.id !== id),
          };
        }
      }

      // If not an array, initialize with the first object
      return {
        ...prev,
        ['children']: { id },
      };
    });
  };

  const handleDivorcePartner = () => {
    setNoChanges(false);
    setDeleteData((prev: any) => ({
      ...prev,
      partnerId: previousData.partner?.id,
    }));
    setFormData((prev: any) => ({
      ...prev,
      partner: null,
    }));
  };

  const handleSelectedValue = (name: string, id: number) => {
    setFormData((prev) => ({ ...prev, name, id }));
    setShowList(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (noChanges) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/moderator/editRelationship/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ deleteData: deleteData, hasPartner: hasPartner, childrenOrder: formData.children }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (toast) {
          toast.show(errorData.error || "Failed to update member", "error", 5000);
        } else {
          alert(errorData.error || "Failed to update member");
        }
        throw new Error(errorData.error || "Failed to update member");
      }

      const result = await response.json();

      if (result) {
        toast?.show("Member updated successfully", "success", 5000);
      }

      setFormData(editRelationshipDefaultFormValue);
      setDeleteData(editRelationshipDefaultDeleteValue);
      setNoChanges(true);
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
          <p className="mt-20 px-2 bg-field_color border border-border_color text-text_color rounded-md z-[100]">loading...</p>
        </div>}
        <div className="w-full md:max-w-xl p-4 mx-auto">
          <div className="flex items-center mb-3">
            <span className="hidden md:block"><AddRelationship /></span>
            <Link href={"/add_edit"} className="md:hidden block">
              <span><BackButton /></span>
            </Link>
            <p className="text-2xl font-semibold text-center text-text_color underline pl-3">
              Edit Relationship
            </p>
          </div>
          <EditRelationShipForm
            handleShowList={handleShowList}
            handleDivorcePartner={handleDivorcePartner}
            handleRemoveChildrenValue={handleRemoveChildrenValue}
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            setNoChanges={setNoChanges}
          />
          <LinkButtonOutline buttonText="Cancel" linkto="/add_edit" className="hidden md:block" />
        </div>
      </Container>
      <div
        onClick={() => setShowList(false)}
        className={`fixed md:hidden ${showList ? 'top-0 bg-gray-500/60' : 'bottom-full delay-300 bg-gray-300/5'} inset-0 z-[100] duration-500 ease-in-out`}
      />
      <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background ${showList ? 'md:border-l md:border-border_color z-[100] rounded-t-md md:rounded-none -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full lg:max-w-lg mx-auto md:h-[calc(100vh-3rem)]`}>
        <div className={`overflow-x-hidden ${showList ? 'visible md:delay-300 transition-all ease-in-out' : 'invisible'}`}>
          <MemberList
            forType={'editRelationship'}
            getSelectedValues={formData}
            setSelectedValue={handleSelectedValue}
            openList={setShowList}
            multiselect={false}
            descendant={null}
          />
        </div>
      </div>
    </div>
  );
}