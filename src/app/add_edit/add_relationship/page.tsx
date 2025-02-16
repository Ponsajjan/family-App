"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { LinkButtonOutline } from "@/components/Button";
import MemberList from "@/components/MemberList";
import { AddRelationship, BackButton } from "@/utils/Icons";
import useAddMember from "@/hooks/add_relationship/useAddMember";
import useAddPartner from "@/hooks/add_relationship/useAddPartner";
import { AddRelationDefaultFormValue, AddRelationFormValuesType, memberListConstrainType } from "@/types/add__edit/add_relationship/types";
import AddRelationShipForm from "@/components/forms/AddRelationShipForm";
import { useToast } from "@/components/Toast";

export default function EditMemberDetails () {
  const toast = useToast();
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>();
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newChildrenData, setNewChildrenData] = useState<AddRelationFormValuesType>(AddRelationDefaultFormValue);
  const [showListFor, setShowListFor] = useState<'selectMember' | 'selectChildren' | 'selectPartner'>('selectMember');
  const [showList, setShowList] = useState<boolean>(false);
  
  // const [showList, setShowListqq] = useState<boolean>(true);
  // const [showListqq, setShowList] = useState<boolean>(false);
  const [memberListConstrain, setMemberListConstrain] = useState<memberListConstrainType>({
    gender: null,
    excludeId: [],
    descendant: null
  })
  const {
    memberloading,
    descendant,
    selectedMemberData,
    excludeMemberRelation} = useAddMember({selectedMemberId});

  const {
    patnerLoading,
    selectedPartnerData,
    excludePartnerRelation} = useAddPartner({selectedPartnerId, selectedMemberData});
 
  const handleShowList = (field: 'selectMember' | 'selectChildren' | 'selectPartner') => {
    setShowListFor(field);
    setMemberListConstrain((prevParams) => ({
      ...prevParams,
      gender: selectedMemberData?.gender,
      excludeId: [...excludeMemberRelation, ...excludePartnerRelation],
      descendant: descendant
    }));
    setShowList(true);
  };

  const handleSelectedValue = (name: string, id: number, select: string) => {
  
    const updateData = (prev: any) => {
      if (Array.isArray(prev['children'])) {
        const exists = prev['children'].some((entry: { id: number; name: string }) => entry.id === id);
          if (exists) {
          return {
            ...prev,
            ['children']: prev['children'].filter((entry: { id: number; name: string }) => entry.id !== id),
          };
        } else {
          return {
            ...prev,
            ['children']: [...prev['children'], { id, name }],
          };
        }
      }
    };
  
    switch (select) {
      case 'selectMember':
        setSelectedMemberId(id);
        setSelectedPartnerId(null);
        setShowList(false);
        break;
    
      case 'selectPartner':
        setSelectedPartnerId(id);
        setError(null);
        setShowList(false);
        break;
    
      case 'selectChildren':
        setNewChildrenData(updateData);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPartnerData.id === undefined && selectedMemberData.partner === null) { // No partner selected
      setError('Select partner');
      return
    }
    if (selectedPartnerData.id === undefined && newChildrenData.children.length === 0) { // No changes made
      return
    }
    try {
      setLoading(true);
      setShowList(false)
      const isMale = selectedMemberData.gender === "Male";
      const isFemale = selectedMemberData.gender === "Female";

      const memberData = {
        partnerId: selectedMemberData.partner?.id ? selectedMemberData.partner?.id : selectedPartnerData.id,
        ...(isMale && {
          fatherOf: {connect: [
            ...selectedMemberData.children.map((child: {name: string, id: number}) => ({ id: child.id })),
            ...newChildrenData.children.map((child: {name: string, id: number}) => ({ id: child.id })),
            ...selectedPartnerData.children.map((child: {name: string, id: number}) => ({ id: child.id }))
          ]},
        }),
        ...(isFemale && {
          motherOf: {connect: [
            ...selectedMemberData.children.map((child: {name: string, id: number}) => ({ id: child.id })),
            ...newChildrenData.children.map((child: {name: string, id: number}) => ({ id: child.id })),
            ...selectedPartnerData.children.map((child: {name: string, id: number}) => ({ id: child.id }))
          ]},
        }),
      };
  
      const response = await fetch(`/api/addRelationship/${selectedMemberData?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (toast) {
          toast.show(errorData.error || "Failed to update member", "error", 5000)
        }
        throw new Error(errorData.error || "Failed to update member");
      }
  
      const result = await response.json();
      if (!response.ok) {
        if (toast) {
          toast.show(result.error || "Something went wrong", "error", 5000);
        }
        throw new Error(result.error || "Something went wrong");
        // throw allows the error to be caught and handled by any surrounding `try...catch` blocks or global error handlers
      } else {
        if (toast) {
          toast.show(result.message, "success", 5000);
        }
      }
  
      // Reset the form
      setSelectedMemberId(null);
      setSelectedPartnerId(null);
      setNewChildrenData(AddRelationDefaultFormValue);
    } catch (error: any) {
      if (toast) {
        toast.show(error.error || "Failed to update member", "error", 5000);
      } else {
        alert(error.error || "Failed to update member.");
      }
    } finally {
      setLoading(false);
    }
    return
  };

  return (
    <div className="md:flex text-text_color">
      <Container className='relative'>
        {(memberloading || patnerLoading || loading) && <div className={`absolute inset-0 flex justify-center items-start bg-gray-50/30 z-10`}>
            <p className="mt-20 px-2 bg-field_color border border-border_color text-text_color rounded-md z-[100]">loading...</p>
          </div>}
        <div className="w-full md:max-w-xl p-4 mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <span className="hidden md:block"><AddRelationship /></span>
              <Link href={"/add_edit"} className="md:hidden block">
                <span><BackButton /></span>
              </Link>
              <p className="cursor-pointer text-2xl font-semibold text-center text-text_color underline pl-3">
                Add Relationship
              </p>
            </div>
          </div>
          <AddRelationShipForm 
            selectedMemberData={selectedMemberData}
            selectedPartnerData={selectedPartnerData}
            newChildrenData={newChildrenData}
            setSelectedPartnerId={setSelectedPartnerId}
            setShowListFor={setShowListFor}
            handleShowList={handleShowList}
            handleSelectedValue={handleSelectedValue}
            handleSubmit={handleSubmit}
            error={error}
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
            forType={showListFor} 
            gender={memberListConstrain?.gender} 
            excludeId={memberListConstrain?.excludeId} 
            getSelectedValues={newChildrenData} 
            setSelectedValue={ handleSelectedValue } 
            openList={setShowList} 
            multiselect={'selectChildren' === showListFor} 
            descendant={memberListConstrain?.descendant} 
          />
        </div>
      </div>
    </div>
  );
}