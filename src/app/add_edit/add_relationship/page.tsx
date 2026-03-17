"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { LinkButtonOutline } from "@/components/Button";
import MemberList from "@/components/MemberList";
import { AddRelationship, BackButton, Warning } from "@/utils/Icons";
import useAddMember from "@/hooks/add_relationship/useAddMember";
import useAddPartner from "@/hooks/add_relationship/useAddPartner";
import { AddRelationDefaultFormValue, AddRelationFormValuesType, memberListConstrainType } from "@/types/add__edit/add_relationship/types";
import AddRelationShipForm from "@/components/forms/AddRelationForm";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/contexts/AuthContext";
import SlidePanel from "@/components/SlidePanel";
import { useSWRConfig } from "swr";

export default function AddRelationshipDetails() {
  const toast = useToast();
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>();
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [allowChildrenSelect, setAllowChildrenSelect] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [newChildrenData, setNewChildrenData] = useState<AddRelationFormValuesType>(AddRelationDefaultFormValue);
  const [showListFor, setShowListFor] = useState<'selectMember' | 'selectChildren' | 'selectPartner'>('selectMember');
  const [showList, setShowList] = useState<boolean>(false);
  const { mutate } = useSWRConfig();
  const { logout } = useAuth();
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
    pendingVerification } = useAddMember({ selectedMemberId });

  const {
    patnerLoading,
    selectedPartnerData,
    excludePartnerRelation } = useAddPartner({ selectedPartnerId, selectedMemberData });

  const handleShowList = (field: 'selectMember' | 'selectChildren' | 'selectPartner') => {
    setShowList(true);
    if (field === showListFor) return // This if to triger MemberList fetch only when 'showListFor' value changes
    setShowListFor(field);
    setMemberListConstrain((prevParams) => ({
      ...prevParams,
      gender: selectedMemberData?.gender,
      excludeId: [...excludeMemberRelation, ...excludePartnerRelation, ...newChildrenData.children?.map((child: any) => (child.id))],
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
        if (id === selectedMemberId) {
          setShowList(false);
          return;
        }
        setSubmitError("");
        setSelectedMemberId(id);
        setSelectedPartnerId(null);
        setNewChildrenData(AddRelationDefaultFormValue)
        setShowList(false);
        break;

      case 'selectPartner':
        if (id === selectedPartnerId) {
          setShowList(false);
          return;
        }
        setSubmitError("");
        setSelectedPartnerId(id);
        setShowList(false);
        break;

      case 'selectChildren':
        setSubmitError("");
        setNewChildrenData(updateData);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPartnerData.id === undefined && selectedMemberData.partner === null) { // No partner selected
      setAllowChildrenSelect(true);
    }

    if (!selectedPartnerData.id && newChildrenData.children?.length === 0) { // No changes made
      toast?.show("No new relationship added", "error", 5000)
      return
    }
    try {
      setLoading(true);
      setSubmitError("");
      setShowList(false)
      const isMale = selectedMemberData.gender === "Male";
      const isFemale = selectedMemberData.gender === "Female";

      const getOrderedChildren = () => {
        const allChildren = [
          ...(selectedMemberData.children?.map((child: any) => ({ ...child, source: 'member' })) || []),
          ...(selectedPartnerData?.children?.map((child: any) => ({ ...child, source: 'partner' })) || []),
          ...(newChildrenData.children?.map((child: any) => ({ ...child, source: 'new' })) || [])
        ];

        return allChildren.map((child, index) => ({
          id: child.id,
          order: index + 1
        }));
      };

      const memberData = {
        partnerId: selectedMemberData.partner?.id ?? selectedPartnerData?.id,
        ...(isMale && { fatherOf: getOrderedChildren() }),
        ...(isFemale && { motherOf: getOrderedChildren() }),
      };

      const response = await fetch(`/api/addRelationship/${selectedMemberData?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(memberData),
      });
      // Handle 401 Unauthorized
      if (response.status === 401) {
        logout();
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.error || "Failed to update member";
        toast?.show(errorMsg, "error", 5000)
        setSubmitError(errorMsg);
        return
      }

      const result = await response.json();
      if (!response.ok) {
        setSubmitError(result.error || "Something went wrong");
        toast?.show(result.error || "Something went wrong", "error", 5000);
      } else {
        if (pendingVerification > 0 || result.message?.includes('verification')) {
          // Clear SWR cache for /api/moderator
          mutate('/api/moderator', undefined, { revalidate: false });
        }
        toast?.show(result.message, "success", 5000);
        // Reset the form
        setSelectedMemberId(null);
        setSelectedPartnerId(null);
        setNewChildrenData(AddRelationDefaultFormValue);
        setSubmitError("");
      }

    } catch (error: any) {
      const errorMsg = error.message || "Failed to update member";
      toast?.show(errorMsg, "error", 5000);
      setSubmitError(errorMsg);
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
        <div className="w-full md:max-w-xl px-4 py-5 md:py-10 mx-auto">
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
            allowChildrenSelect={allowChildrenSelect}
            submitError={submitError}
          />
          <LinkButtonOutline buttonText="Cancel" linkto="/add_edit" className="hidden md:block" />
        </div>
      </Container>
      <SlidePanel setShowDetails={setShowList} showDetails={showList} >
        <MemberList
          forType={showListFor}
          gender={memberListConstrain?.gender}
          excludeId={memberListConstrain?.excludeId}
          getSelectedValues={newChildrenData}
          setSelectedValue={handleSelectedValue}
          openList={setShowList}
          multiselect={'selectChildren' === showListFor}
          descendant={memberListConstrain?.descendant}
        />
      </SlidePanel>
    </div>
  );
}