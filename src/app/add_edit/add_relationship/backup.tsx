"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { ButtonSolid, LinkButtonOutline } from "@/components/Button";
import MemberList from "@/components/MemberList";
import { AddRelationship, BackButton, ChangeMember, MinusIcon, PlusIcon } from "@/utils/Icons";
import { useToast } from "@/components/Toast";
import { useRouter } from 'next/navigation';
import { AddRelationDefaultFormValue } from "@/types/add__edit/add_relationship/types";
import useAddMember from "@/hooks/add_relationship/useAddMember";
import useAddPartner from "@/hooks/add_relationship/useAddPartner";

export default function EditMemberDetails () {
  const toast = useToast();
  const [refreshList, setRefresh] = useState(true);
  const [selectedMemberID, setSelectedMemberID] = useState<string | null>('');
  const [selectedPartnerID, setSelectedPartnerID] = useState<string | null>('');
  const [showListFor, setShowListFor] = useState('selectMember');
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [combinedData, setCombinedData] = useState<any>([])

  const handleShowList = (field: string) => {
    setShowListFor(field);
    setShowList(true);
  };

  const { memberloading,
    selectedMemberData,
    descendant,
    excludeMemberRelation } = useAddMember({ selectedMemberID });

  const { patnerLoading,
    selectedPartnerData,
    partnerChildren,
    excludePartnerRelation } = useAddPartner({ selectedPartnerID, selectedMemberData });

  const keyMap:any = {
    selectMember: "name",
    selectPartner: "partner",
    selectChildren: "children",
  };

  const handleSelectedValue = (name: any, id: string) => { 
    const key = keyMap[showListFor];
    if (!key) return;
  
    const updateData = (prev: any) => {
      if (Array.isArray(prev[key])) {
        // Check if the name already exists
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
            [key]: [...prev[key], { id, name }],
          };
        }
      }
  
      // If not an array, initialize with the first object
      setShowList(false);
      return {
        ...prev,
        [key]: { id, name },
      };
    };
  
    if (showListFor === 'selectMember') {
      setSelectedMemberID(id);
      setSelectedPartnerID(null);
      setShowList(false);
    } else if (showListFor === 'selectPartner') {
      setSelectedPartnerID(id);
      setShowList(false);
    } else {
      setCombinedData(updateData);
    }
  };

  const handleRemoveChildren = (id: string) => {
    const updateData = (prev: any) => {
      if (Array.isArray(prev['children'])) {
        // Check if the item already exists
        const exists = prev['children'].some((entry: any) => entry.id === id);
  
        if (exists) {
          // Remove the existing entry
          return {
            ...prev,
            ['children']: prev['children'].filter((entry: any) => entry.id !== id),
          };
        }
      }
    };

    setCombinedData(updateData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPartnerID == null) {
      return
    }
    try {
      setLoading(true);
      setShowList(false)
      const isMale = combinedData.gender === "Male";
      const isFemale = combinedData.gender === "Female";

      const memberData = {
        gender: combinedData.gender,
        partnerId: combinedData.partner?.id ? parseInt(combinedData.partner?.id, 10) : null,
        ...(isMale && {
          fatherOf: combinedData.children && combinedData.children.length > 0 ? combinedData.children.map((child: any) => child.id) : [],
        }),
        ...(isFemale && {
          motherOf: combinedData.children && combinedData.children.length > 0 ? combinedData.children.map((child: any) => child.id) : [],
        }),
      };
  
      const response = await fetch(`/api/addRelationship/${combinedData.name?.id}`, {
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
      console.log("Member updated successfully:", result);
  
      if (toast) {
        toast.show("Member updated successfully", "success", 5000);
      }
      setSelectedMemberID(null);
      setSelectedPartnerID(null);
      setRefresh((prev) => !prev);
    } catch (error: any) {
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
              <p className="cursor-pointer text-2xl font-semibold text-center text-text_color underline pl-3">
                Add Relationship
              </p>
            </div>
          </div>
          <form className="text-text_color relative" onSubmit={handleSubmit}>
            {!selectedMemberData?.name && <div onClick={() => handleShowList('selectMember')} className={`absolute inset-0 z-10`}></div>}
            <p className="text-sm">Member</p>
            <div 
              onClick={() => handleShowList('selectMember')} 
              className={`w-full flex justify-between items-center ${!selectedMemberData.name || selectedMemberData.name == 'undefined' ? 'outline-2 outline-dashed outline-offset-2 outline-border_active' : ''} px-2 border bg-field_color border-border_color text-sm placeholder:text-xs rounded-md mb-2 cursor-pointer`} 
            >
              {selectedMemberData?.name !== 'undefined' ? 
                <>
                  <span className="py-2 w-full">{selectedMemberData.name}</span> 
                  <span><ChangeMember /></span>
                </> :
                <span className='py-2 w-full text-gray-400'>Select Member</span>}
            </div>

            <p className="text-sm">Partner</p>
            <div 
              className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2" 
            >
              {(selectedMemberData?.partner?.name !== 'undefined')
                ? <span className="py-2 w-full cursor-not-allowed">{selectedMemberData.partner?.name}</span>
                : (selectedPartnerData?.name !== 'undefined')
                  ? <>
                      <span className="py-2 w-full">{selectedPartnerData?.name}</span>
                      <span
                        onClick={() => setSelectedPartnerID(null)}
                        className="border border-border_color cursor-pointer rounded-md h-fit">
                        <MinusIcon />
                      </span>
                    </>
                  : <span onClick={() => handleShowList('selectPartner')} className='py-2 w-full text-gray-400 cursor-pointer'>Select Partner</span>}
            </div>

            

            {(selectedMemberData?.children.length > 0 || selectedPartnerData.children.length > 0 || partnerChildren.length > 0) &&
            <div>
              <p className="text-sm">Children</p>
              <>
                {selectedMemberData.children?.map((item: {id:any, name:string}) => (
                  <div key={item?.id} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2 cursor-not-allowed" >
                    <span className="py-2 w-full">{item?.name}</span>
                  </div>)
                )}
              </>
              <>
                {partnerChildren?.map((item: {id:any, name:string}) => (
                  <div key={item?.id} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2 cursor-not-allowed" >
                    <span className="py-2 w-full">{item?.name}</span>
                  </div>)
                )}
              </>
              <>
                {selectedPartnerData.children?.map((item: {id:any, name:string}) => (
                  <div key={item?.id} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2" >
                    <span className="py-2 w-full">{item?.name}</span>
                    <span
                      onClick={() => handleRemoveChildren(item?.id)}
                      className="border border-border_color rounded-md h-fit cursor-pointer">
                      <MinusIcon />
                    </span>
                  </div>)
                )}
              </>
            </div>}
            {(selectedMemberData.partner && selectedMemberData.partner?.name !== 'undefined' || selectedPartnerData.partner && selectedPartnerData.partner?.name !== 'undefined') && 
            <div className="flex items-center cursor-pointer text-xs ml-0 mr-auto py-1 px-4 border border-border_color rounded-full w-fit" onClick={() => handleShowList('selectChildren')}>
              <span className="pr-2">Add Children</span>
              <span className="w-4 h-4"><PlusIcon /></span>
            </div>}
            <div className="mt-8 mb-4">
              <ButtonSolid type="submit" className="w-full" buttonText="Add Relationship" />
            </div>
          </form>
          <LinkButtonOutline buttonText="Cancel" linkto="/add_edit" className="hidden md:block" />
        </div>
      </Container>
      <div
        onClick={() => setShowList(false)}
        className={`fixed md:hidden ${showList ? 'top-0 bg-gray-500/60' : 'bottom-full delay-300 bg-gray-300/5'} inset-0 z-[100] duration-500 ease-in-out`}
      />
      <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background overflow-x-hidden ${showList ? 'md:border-l md:border-border_color z-[100] rounded-t-md md:rounded-none -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full lg:max-w-lg mx-auto overflow-y-auto`}>
        <div className={`overflow-x-hidden ${showList ? 'visible md:delay-300 transition-all ease-in-out' : 'invisible'}`}>
          <MemberList forType={showListFor} gender={selectedMemberData?.gender} excludeId={[...excludeMemberRelation, ...excludePartnerRelation]} getSelectedValues={selectedPartnerData} setSelectedValue={ handleSelectedValue } openList={setShowList} refreshList={refreshList} multiselect={'selectChildren' === showListFor} descendant={descendant} />
        </div>
      </div>
    </div>
  );
}