"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { ButtonSolid, LinkButtonOutline } from "@/components/Button";
import MemberList from "@/components/MemberList";
import { AddRelationship, BackButton, ChangeMember, MinusIcon } from "@/utils/Icons";
import { useToast } from "@/components/Toast";
import { useRouter } from 'next/navigation';

export default function EditMemberDetails () {
  const toast = useToast();
  const router = useRouter();
  const [memberName, setMemberName] = useState('');
  const [refreshList, setRefresh] = useState(true);

  const [excludeMemberRelation, setExcludeMemberRelation] = useState<any>([]);
  const [excludePartnerRelation, setExcludePartnerRelation] = useState<any>([]);
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

  const defaultValue: DefaultValue = {
    name: null,
    gender: undefined,
    partner: null,
    children: [],
  };

  const [prevformData, setPrevFormData] = useState(defaultValue);
  const [newformData, setNewFormData] = useState(defaultValue);
  const [partnerChildren, setPatnerChildren] = useState<any>([])
  const [combinedData, setCombinedData] = useState(defaultValue);

  const [loading, setLoading] = useState(false);
  const [showListFor, setShowListFor] = useState('selectMember');
  const [showList, setShowList] = useState(false);

  const handleShowList = (field: string) => {
    setShowListFor(field);
    setShowList(true);
  };

  useEffect(() => {
    if (prevformData.name?.id) {
      const fetchUser = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/addRelationship/${prevformData.name?.id}`);
          if (!response.ok) throw new Error('Failed to fetch user details');
      
          const { data } = await response.json();
          const dbData = data[0];

          // Determine children based on gender
          const childrenData = dbData.gender === 'Male' ? dbData.fatherOf : dbData.motherOf;

          const formatedDbData = {
            name:  {id: `${dbData.id}`, name: `${dbData.name}`},
            gender: dbData.gender,
            partner: {id: `${dbData.partner?.id}`, name: `${dbData.partner?.name}`},
            children: childrenData ? childrenData : [],
          }
          setPrevFormData(formatedDbData);
          setNewFormData(defaultValue)
          setCombinedData(formatedDbData)
          setMemberName(dbData.name)

          const excludeIds = [
            dbData?.id ? parseInt(dbData.id, 10) : null,
            dbData.partner?.id ? parseInt(dbData.partner.id, 10) : null,
            dbData.father?.id ? parseInt(dbData.father.id, 10) : null,
            dbData.mother?.id ? parseInt(dbData.mother.id, 10) : null,
            ...(childrenData ? childrenData.map((child: any) => parseInt(child.id, 10)) : []),
          ].filter(Boolean);
          setExcludePartnerRelation(excludeIds);
        } catch (error) {
            console.error('Error fetching user details:', error);
            if (toast) {
              toast.show("Error fetching user details", "error", 5000)
            }
            router.push('/add_edit');
        } finally {
            setLoading(false)
        }
      }
  
      fetchUser()
    }
  }, [prevformData.name?.id])

  useEffect(() => {
    if (newformData.partner?.id) {
      const fetchPartner = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/addRelationship/${newformData.partner?.id}`);
          if (!response.ok) throw new Error('Failed to fetch user details');
      
          const { data } = await response.json();
          const dbData = data[0];

          // Determine children based on gender
          const childrenData = dbData.gender === 'Male' ? dbData.fatherOf : dbData.motherOf;


          if (childrenData && Array.isArray(childrenData)) {
            const formattedChildren = childrenData?.map((child) => ({
              id: child.id,
              name: child.name,
            }));
          
            setPatnerChildren(formattedChildren);
            setCombinedData((prev) => ({
              ...prev,
              children: [...prev.children, ...formattedChildren],
            }));
          }

          const excludeIds = [
            dbData?.id ? parseInt(dbData.id, 10) : null,
            dbData.partner?.id ? parseInt(dbData.partner.id, 10) : null,
            dbData.father?.id ? parseInt(dbData.father.id, 10) : null,
            dbData.mother?.id ? parseInt(dbData.mother.id, 10) : null,
            ...(childrenData ? childrenData.map((child: any) => parseInt(child.id, 10)) : []),
          ].filter(Boolean);
          setExcludePartnerRelation(excludeIds);

        } catch (error) {
            console.error('Error fetching user details:', error);
            if (toast) {
              toast.show("Error fetching user details", "error", 5000)
            }
            router.push('/add_edit');
        } finally {
            setLoading(false)
        }
      }
  
      fetchPartner()
    }
  }, [newformData.partner?.id])

  const handleCancelPartnerValue = () => {
    setNewFormData((prev: any) => ({
      ...prev,
      partner: null,
      children: [],
    }));
  
    setCombinedData((prev: any) => ({
      ...prev,
      partner: null, // Explicitly set partner to null
      children: prev.children.filter(
        (entry: any) => !partnerChildren.some((child: any) => child.id === entry.id)
      ),
    }));
  
    setPatnerChildren([]);
    setShowListFor('selectPartner');
  };

  const keyMap:any = {
    selectMember: "name",
    selectPartner: "partner",
    selectChildren: "children",
  };

  const handleSelectedValue = (item: any, id: string) => {
    const key = keyMap[showListFor];
    if (!key) return;
  
    const updateData = (prev: any) => {
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
      setShowList(false);
      return {
        ...prev,
        [key]: { id, name: item },
      };
    };
  
    if (showListFor === 'selectMember') {
      setPrevFormData((prev: any) => ({ ...prev, 'name': { id, name: item } }));
      setShowList(false);
    } else {
      setNewFormData(updateData);
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

    setNewFormData(updateData);
    setCombinedData(updateData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newformData.partner?.id == null && newformData.children.length == 0) {
      return
    }
    try {
      setLoading(true);
  
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
  
      setPrevFormData(defaultValue);
      setNewFormData(defaultValue);
      setCombinedData(defaultValue);
      setMemberName("");
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
        {loading && <div className={`absolute inset-0 flex justify-center items-start bg-gray-50/30 z-10`}>
            <p className="mt-20 px-2 bg-field_color border border-border_color rounded-md z-[100]">loading...</p>
          </div>}
        <div className="w-full md:max-w-xl p-4 mx-auto">
          <div className="flex justify-between items-center mb-4">
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
            {!memberName && <div onClick={() => handleShowList('selectMember')} className={`absolute inset-0 z-10`}></div>}
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
              className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2" 
            >
              {(prevformData.partner && prevformData.partner?.name !== 'undefined')
                ? <span className="py-2 w-full cursor-not-allowed">{prevformData.partner?.name}</span>
                : (newformData.partner && newformData.partner?.name !== 'undefined')
                  ? <>
                      <span className="py-2 w-full">{newformData.partner?.name}</span>
                      <span
                        onClick={() => handleCancelPartnerValue()}
                        className="border border-border_color cursor-pointer rounded-md h-fit">
                        <MinusIcon />
                      </span>
                    </>
                  : <span onClick={() => handleShowList('selectPartner')} className='py-2 w-full text-gray-400 cursor-pointer'>Select Partner</span>}
            </div>

            

            {(prevformData.children.length > 0 || newformData.children.length > 0) &&
            <div>
              {(prevformData.children.length > 0 || newformData.children.length > 0) && <p className="text-sm">Children</p>}
              <>
                {prevformData.children?.map((item: {id:any, name:string}, index:number) => (
                  <div key={index} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2 cursor-not-allowed" >
                    <span className="py-2 w-full">{item?.name}</span>
                  </div>)
                )}
              </>
              <>
                {partnerChildren?.map((item: {id:any, name:string}, index:number) => (
                  <div key={index} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2 cursor-not-allowed" >
                    <span className="py-2 w-full">{item?.name}</span>
                  </div>)
                )}
              </>
              <>
                {newformData.children?.map((item: {id:any, name:string}, index:number) => (
                  <div key={index} className="w-full flex justify-between items-center px-2 border bg-field_color border-border_color text-sm rounded-md mb-2" >
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
            {(prevformData.partner && prevformData.partner?.name !== 'undefined' || newformData.partner && newformData.partner?.name !== 'undefined') && 
            <p className="cursor-pointer text-sm text-text_color px-2 w-fit border border-border_color rounded-full" onClick={() => handleShowList('selectChildren')}>Add Children +</p>}
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
          <MemberList forType={showListFor} gender={prevformData?.gender} excludeId={[...excludeMemberRelation, ...excludePartnerRelation]} getSelectedValues={newformData} setSelectedValue={ handleSelectedValue } openList={setShowList} refreshList={refreshList} multiselect={'selectChildren' === showListFor}/>
        </div>
      </div>
    </div>
  );
}