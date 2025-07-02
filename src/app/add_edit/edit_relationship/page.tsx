"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { ButtonOutline } from "@/components/Button";
import MemberList from "@/components/MemberList";
import { AddRelationship, BackButton, Warning } from "@/utils/Icons";
import { useToast } from "@/components/Toast";
import { DeleteValueTypes, editRelationshipDefaultDeleteValue, editRelationshipDefaultFormValue, EditRelationshipValueTypes } from "@/types/add__edit/edit_relationship/types";
import EditRelationShipForm from "@/components/forms/EditRelationForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import SlidePanel from "@/components/SlidePanel";

export default function EditRelationshipDetails() {
  const toast = useToast();
  const [noChanges, setNoChanges] = useState<boolean>(true);
  const [formData, setFormData] = useState<EditRelationshipValueTypes>(editRelationshipDefaultFormValue);
  const [deleteData, setDeleteData] = useState<DeleteValueTypes>(editRelationshipDefaultDeleteValue);
  const [hasPartner, setHasPatner] = useState<number | undefined | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showList, setShowList] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [resetValue, setResetValue] = useState<any>({});
  const {logout} = useAuth();
  const router = useRouter();

  const handleShowList = () => {
    setShowList(true);
  };

  useEffect(() => {
    if (formData.id) {
      const fetchMembers = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/editRelationship/${formData.id}`,
            {
              method: 'GET',
              headers: { 
                'Content-Type': 'application/json'
              },
            }
          );
          // Handle 401 Unauthorized
          if (response.status === 401) {
            logout();
            return;
          }
          if (!response.ok) throw new Error('Failed to fetch member details');
          const { data } = await response.json();

          // Ensure children are sorted by order
          if (data.children && Array.isArray(data.children)) {
            data.children.sort((a: any, b: any) => a.order - b.order);
          }
          setResetValue({'data': data, 'hasPartner': data.partner?.id})

          setFormData(data);
          setHasPatner(data.partner?.id);
          setNoChanges(true);
        } catch (error: any) {
          toast?.show(error.message || "Error fetching member details", "error", 5000);
          router.push('/add_edit');
        } finally {
          setLoading(false);
        }
      };

      fetchMembers();
    }
  }, [formData.id, toast, router, logout]);

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
    });
  };

  const handleDivorcePartner = () => {
    setDeleteData((prev: any) => ({
      ...prev,
      partnerId: formData.partner?.id,
    }));
    setNoChanges(false);
    setFormData((prev: any) => ({
      ...prev,
      partner: null,
    }));
  };

  const handleClose = () => {
    if (!noChanges) {
      setFormData(resetValue.data);
      setHasPatner(resetValue.hasPartner);
      setDeleteData(editRelationshipDefaultDeleteValue)
      setNoChanges(true);
      return
    }
    router.push("/add_edit");
  }
  
  const handleSelectedValue = (name: string, id: number) => {
    setFormData((prev) => ({ ...prev, name, id }));
    setShowList(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (noChanges) {
    //   toast?.show("No changes to update", "error", 5000);
    //   return;
    // }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/editRelationship/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({ 
          deleteData: deleteData, 
          hasPartner: hasPartner, 
          childrenOrder: formData.children?.map(({ id, order }) => ({ id, order }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast?.show(errorData.error || "Failed to update member", "error", 5000);
        throw new Error(errorData.error || "Failed to update member");
      }

      const result = await response.json();

      if (result) {
        toast?.show(result.message, "success", 5000);
      }

      setFormData(editRelationshipDefaultFormValue);
      setDeleteData(editRelationshipDefaultDeleteValue);
      setNoChanges(true);
    } catch (error: any) {
      console.error("Error updating member:", error);
      toast?.show(error.message || "Failed to update member", "error", 5000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="md:flex text-text_color">
      <Container className='relative'>
        {(loading || submitting) && <div className={`absolute inset-0 flex justify-center items-start bg-gray-50/30 z-20 cursor-wait`}>
          <p className="mt-20 px-2 bg-field_color border border-border_color text-text_color rounded-md z-[100]">{loading ? 'Loading...' : 'Submitting...'}</p>
        </div>}
        <div className="w-full md:max-w-xl px-4 py-5 md:py-10 mx-auto">
          <div className="flex items-center mb-3">
            <span className="hidden md:block"><AddRelationship /></span>
            <Link href={"/add_edit"} className="md:hidden block">
              <span><BackButton /></span>
            </Link>
            <p className="text-2xl font-semibold text-center text-text_color underline pl-3">
              Edit Relationship
            </p>
          </div>
          {(formData.pendingVerification > 0) && <p className="w-full py-1 px-2 my-6 border border-border_color border-dashed rounded-md bg-field_color"><span className='inline-block align-bottom pr-2'><Warning /></span>{formData.pendingVerification} pending verification</p>}
          <EditRelationShipForm
            handleShowList={handleShowList}
            handleDivorcePartner={handleDivorcePartner}
            handleRemoveChildrenValue={handleRemoveChildrenValue}
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            setNoChanges={setNoChanges}
            submitting={submitting}
          />
          <ButtonOutline buttonText={noChanges ? "Cancel" : "Reset Changes"} onClick={handleClose} className="hidden md:block w-full" />
        </div>
      </Container>
      <SlidePanel setShowDetails={setShowList} showDetails={showList} >
        <MemberList
          forType={'editRelationship'}
          getSelectedValues={formData}
          setSelectedValue={handleSelectedValue}
          openList={setShowList}
          multiselect={false}
          descendant={null}
        />
      </SlidePanel>
    </div>
  );
}