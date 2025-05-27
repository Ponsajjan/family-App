"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { LinkButtonOutline } from "@/components/Button";
import MemberList from "@/components/MemberList";
import { AddRelationship, BackButton, NextArrow, PrevArrow, Warning } from "@/utils/Icons";
import useAddMember from "@/hooks/add_relationship/useAddMember";
import useAddPartner from "@/hooks/add_relationship/useAddPartner";
import { AddRelationDefaultFormValue, AddRelationFormValuesType, memberListConstrainType } from "@/types/add__edit/add_relationship/types";
import AddRelationShipForm from "@/components/forms/AddRelationForm";
import { useToast } from "@/components/Toast";
import { getCookie } from 'cookies-next';
import { useRouter } from "next/navigation";

export default function AddRelationshipDetails () {
  const toast = useToast();
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>();
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [newChildrenData, setNewChildrenData] = useState<AddRelationFormValuesType>(AddRelationDefaultFormValue);
  const [showListFor, setShowListFor] = useState<'selectMember' | 'selectChildren' | 'selectPartner'>('selectMember');
  const [showList, setShowList] = useState<boolean>(false);
  const token = getCookie('token');
  const router = useRouter(); 
  const [memberListConstrain, setMemberListConstrain] = useState<memberListConstrainType>({
    gender: null,
    excludeId: [],
    descendant: null
  })
  const {
    memberloading,
    descendant,
    selectedMemberData,
    excludeMemberRelation,
    pendingVerification} = useAddMember({selectedMemberId});

  const {
    patnerLoading,
    selectedPartnerData,
    excludePartnerRelation} = useAddPartner({selectedPartnerId, selectedMemberData});
 
  const handleShowList = (field: 'selectMember' | 'selectChildren' | 'selectPartner') => {
    setShowList(true);
    if (field === showListFor) return // This if to triger MemberList fetch only when 'showListFor' value changes
    setShowListFor(field);
    setMemberListConstrain((prevParams) => ({
      ...prevParams,
      gender: selectedMemberData?.gender,
      excludeId: [...excludeMemberRelation, ...excludePartnerRelation, ...newChildrenData.children?.map((child:any) => ( child.id ))],
      descendant: descendant
    }));
  };

  const handleSelectedValue = (name: string, id: number, select: string, verified: boolean) => {
  
    const updateData = (prev: any) => {
      if (Array.isArray(prev['children'])) {
        const exists = prev['children'].some((entry) => entry.id === id);
          if (exists) {
          return {
            ...prev,
            ['children']: prev['children'].filter((entry) => entry.id !== id),
          };
        } else {
          return {
            ...prev,
            ['children']: [...prev['children'], { id, name, verified }],
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
        setShowList(false);
        break;
    
      case 'selectChildren':
        setNewChildrenData(updateData);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPartnerData.id && newChildrenData.children?.length === 0) { // No changes made
      toast?.show("No new relationship added", "error", 5000)
      return
    }
    try {
      setLoading(true);
      setShowList(false)
      const isMale = selectedMemberData.gender === "Male";
      const isFemale = selectedMemberData.gender === "Female";

      const getOrderedChildren = () => {
        const allChildren = [
          ...(selectedMemberData.children?.map((child:any) => ({ ...child, source: 'member' })) || []),
          ...(selectedPartnerData?.children?.map((child:any) => ({ ...child, source: 'partner' })) || []),
          ...(newChildrenData.children?.map((child:any) => ({ ...child, source: 'new' })) || [])
        ];
      
        return allChildren.map((child, index) => ({
          id: child.id,
          order: index + 1
        }));
      };
      
      const memberData = {
        partners: (selectedMemberData.partners !== null &&  selectedMemberData.partners?.length > 0)
          ? selectedMemberData.partners.map((partner: any) => partner.id)
          : selectedPartnerData?.id 
            ? [selectedPartnerData.id] 
            : [],
        ...(isMale && { fatherOf: getOrderedChildren() }),
        ...(isFemale && { motherOf: getOrderedChildren() }),
      };

      console.log("memberData", memberData)
  
      const response = await fetch(`/api/addRelationship/${selectedMemberData?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(memberData),
      });
      // Handle 401 Unauthorized
      if (response.status === 401) {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/login');
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        toast?.show(errorData.error || "Failed to update member", "error", 5000)
        return
      }
  
      const result = await response.json();
      if (!response.ok) {
        toast?.show(result.error || "Something went wrong", "error", 5000);
      } else {
        toast?.show(result.message, "success", 5000);
      }
  
      // Reset the form
      setSelectedMemberId(null);
      setSelectedPartnerId(null);
      setNewChildrenData(AddRelationDefaultFormValue);
    } catch (error: any) {
      toast?.show(error.error || "Failed to update member", "error", 5000);
    } finally {
      setLoading(false);
    }
    return
  };

  return (
    <div className="md:flex text-text_color">
      <Container className='relative'>
        {(memberloading || patnerLoading || loading) && 
        <div className={`absolute inset-0 flex justify-center items-start bg-gray-50/30 z-20 cursor-wait`}>
          <p className="mt-20 px-2 bg-field_color border border-border_color text-text_color rounded-md z-[100]">Loading...</p>
        </div>}
        <div className="w-full md:max-w-xl px-4 py-10 mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center">
                <span className="hidden md:block"><AddRelationship /></span>
                <Link href={"/add_edit"} className="md:hidden block">
                  <span><BackButton /></span>
                </Link>
                <p className="cursor-pointer text-2xl font-semibold text-center text-text_color underline pl-3">
                  Add Relationship
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-6 h-6 md:w-8 md:h-8 border border-border_color rounded-md bg-field_color">
                  <PrevArrow />
                </button>
                <button className="w-6 h-6 md:w-8 md:h-8 border border-border_color rounded-md bg-field_color">
                  <NextArrow />
                </button>
              </div>
            </div>
          </div>
          {(pendingVerification > 0) && <p className="w-full py-1 px-2 my-6 border border-border_color border-dashed rounded-md bg-field_color"><span className='inline-block align-bottom pr-2'><Warning /></span>{pendingVerification} pending verification</p>}
          <AddRelationShipForm
            selectedMemberData={selectedMemberData}
            selectedPartnerData={selectedPartnerData}
            newChildrenData={newChildrenData}
            showListFor={showListFor}
            setNewChildrenData={setNewChildrenData}
            setSelectedPartnerId={setSelectedPartnerId}
            handleShowList={handleShowList}
            handleSelectedValue={handleSelectedValue}
            handleSubmit={handleSubmit}
            submitting={loading}
            showList={showList}
          />
          <LinkButtonOutline buttonText="Cancel" linkto="/add_edit" className="hidden md:block" />
        </div>
      </Container>
      <div
        onClick={() => setShowList(false)}
        className={`fixed md:hidden ${showList ? 'top-0 bg-gray-500/60' : 'bottom-full delay-300 bg-gray-300/5'} inset-0 z-[100] duration-500 ease-in-out`}
      />
      <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background ${showList ? 'md:border-l md:border-border_color z-[100] rounded-t-md md:rounded-none -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full lg:max-w-[580px] mx-auto md:h-[calc(100vh-3rem)]`}>
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