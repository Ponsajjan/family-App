'use client';

import { Female, Filter, FilterClose, FilterSelect, Male, SearchIcon } from '@/utils/Icons';
import React, { useEffect, useState } from 'react';
import Container from "@/components/Container";
import Checkbox from '@/components/CheckBox';
import Input from '@/components/Input';
import { ButtonSolid } from './Button';
import Loading from './Loading';
import { boolean } from 'zod';

interface Member {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  partner?: boolean;
  birthYear?: number;
  parentNames?: string;
}

interface MemberListProps {
  forType:  string // 'selectMember' | 'selectFather' | 'selectMother' | 'selectChildren';
  birthYearThreshold?: number | null;  // Only required for 'selectChildren' case
  setSelectedValue: any;
  openList: any;
  getSelectedValues: any;
  refreshList: boolean;
  multiselect: boolean;
}

export default function MemberList({ forType='selectMember', birthYearThreshold=null, setSelectedValue, openList, getSelectedValues, refreshList, multiselect }: MemberListProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<any[]>([])

  const keyMap:any = {
    selectMember: "name",
    selectFather: "father",
    selectMother: "mother",
    selectPartner: "partner",
    selectChildren: "children",
  };

  const selectedValues = getSelectedValues[keyMap[forType]]

  useEffect(() => {
    function setFilteresUsed(forType: string) {
      switch (forType) {
        case 'selectMember':
          setAppliedFilters(['Male', 'Female', 'Partner Assigned', 'Partner Unassigned', 'Parents Assigned', 'Parents Unassigned']);
          break;
        case 'selectFather':
          setAppliedFilters(['Male', 'Partner Assigned', 'Parents Assigned', 'Parents Unassigned']);
          break;
        case 'selectMother':
          setAppliedFilters(['Female', 'Partner Assigned', 'Parents Assigned', 'Parents Unassigned']);
          break;
        case 'selectChildren':
          setAppliedFilters(['Male', 'Female', 'Partner Assigned', 'Partner Unassigned', 'Parents Unassigned']);
          break;
        default:
          setAppliedFilters([]);
          break;
      }
    }
  
    async function fetchMembers() {
      try {
        setLoading(true)
        setMembers([])
        setError(null);
        
        const response = await fetch(`/api?for=${forType}&birthYearThreshold=${birthYearThreshold}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const membersData: Member[] = await response.json();
        const sortedMembers = membersData.sort((a, b) => a.name.localeCompare(b.name));
        setMembers(sortedMembers);
      } catch (error) {
        console.error("Failed to fetch members:", error);
        setError("Failed to fetch members. Please try again later.");
      } finally {
        setLoading(false)
      }
    }

    setFilteresUsed(forType)
    fetchMembers();
  }, [forType, birthYearThreshold, refreshList]);

  // const handleSelectedValue = (item: any, id: string) => {
  //   const key = keyMap[forType];
  //   if (!key) return;
  
  //   const keyWithId = `${key}_id`; // Create the new key with "_id" appended
  
  //   setSelectedValue((prev: any) => {
  //     if (Array.isArray(prev[key])) {
  //       // For array keys: Add or remove the value
  //       const updatedArray = prev[key].includes(item)
  //         ? prev[key].filter((val: any) => val !== item) // Remove if it exists
  //         : [...prev[key], item]; // Add if it doesn't exist
  
  //       const updatedIdArray = prev[keyWithId]?.includes(id)
  //         ? prev[keyWithId].filter((val: any) => val !== id) // Remove if it exists
  //         : [...(prev[keyWithId] || []), id]; // Add if it doesn't exist, ensure prev[keyWithId] is an array
  
  //       return { ...prev, [key]: updatedArray, [keyWithId]: updatedIdArray };
  //     }
  
  //     // For non-array keys: Set both the value and id
  //     openList(false);
  //     return { ...prev, [key]: item, [keyWithId]: id };
  //   });
  // };
  

  const handleSelectedValue = (item: any, id: string) => {
    const key = keyMap[forType];
    if (!key) return;
  
    setSelectedValue((prev: any) => {
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
      openList(false);
      return {
        ...prev,
        [key]: { id, name: item },
      };
    });
  };
  
  const groupedMembers = members.reduce<{ [key: string]: Member[] }>((acc, member) => {
    const letter = member.name.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(member);
    return acc;
  }, {});

  return (
    <>
      <div className="relative bg-main_background">
        <div className='border-b border-border_color bg-main_background z-10 relative'>
          <div className="relative w-full p-3 border-b border-border_color">
            <div className='flex gap-2'>
              <Input
                placeholder={
                  forType === "selectMember" ? "Select Member To Edit" : 
                  forType === "selectFather" ? "Select Father" : 
                  forType === "selectMother" ? "Select Mother" : 
                  forType === "selectPartner" ? "Select partner" : 
                  "Select Children"
                }  className="pl-9"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <SearchIcon />
              </span>
            </div>
          </div>
          <ul className='p-2 flex gap-2 flex-nowrap overflow-x-auto min-h-[42px] scroll-stable'>
            <li className='py-1 pl-1 pr-4 text-xs border border-border_color bg-field_color rounded-full flex gap-1 items-center justify-between'>
              {appliedFilters.includes('Male') ? <FilterSelect /> : <FilterClose />} <span>Male</span>
            </li>
            <li className='py-1 pl-1 pr-4 text-xs border border-border_color bg-field_color rounded-full flex gap-1 items-center justify-between'>
              {appliedFilters.includes('Female') ? <FilterSelect /> : <FilterClose />} <span>Female</span>
            </li>
            <li className='py-1 pl-1 pr-4 text-xs border border-border_color bg-field_color rounded-full flex gap-1 items-center justify-between'>
              {appliedFilters.includes('Partner Assigned') ? <FilterSelect /> : <FilterClose />} <span className='whitespace-nowrap'>Partner Assigned</span>
            </li>
            <li className='py-1 pl-1 pr-4 text-xs border border-border_color bg-field_color rounded-full flex gap-1 items-center justify-between'>
              {appliedFilters.includes('Partner Unassigned') ? <FilterSelect /> : <FilterClose />} <span className='whitespace-nowrap'>Partner Unassigned</span>
            </li>
            <li className='py-1 pl-1 pr-4 text-xs border border-border_color bg-field_color rounded-full flex gap-1 items-center justify-between'>
              {appliedFilters.includes('Parents Assigned') ? <FilterSelect /> : <FilterClose />} <span className='whitespace-nowrap'>Parents Assigned</span>
            </li>
            <li className='py-1 pl-1 pr-4 text-xs border border-border_color bg-field_color rounded-full flex gap-1 items-center justify-between'>
              {appliedFilters.includes('Parents Unassigned') ? <FilterSelect /> : <FilterClose />} <span className='whitespace-nowrap'>Parents Unassigned</span>
            </li>
          </ul>
        </div>

        <div className='pb-14 h-[60vh] md:h-[calc(100vh-162px)] overflow-y-auto'>
        {loading ? 
          <Loading /> :
          Object.keys(groupedMembers).sort().map((letter) => (
            <div key={letter}>
              <div className="flex text-text_color items-center mx-3 bg-main_background sticky top-0 z-[9]">
                <span className="font-semibold pr-1 whitespace-nowrap">{letter}</span>
                <span className="border-t border-border_color block w-full"></span>
              </div>

              {groupedMembers[letter].map((member) => (
                <div onClick = {() => handleSelectedValue(member.name, member.id)} key={member.id} className="pl-4">
                  <div className="border-l border-border_color py-1 pl-4 pr-3">
                    <div className="cursor-pointer px-3 py-2 flex items-center border border-border_color bg-field_color rounded text-text_color">
                      {multiselect && <div className='pr-3 border-r border-border_color mr-2'>
                        <Checkbox checked={selectedValues.some((value:any) => value.name === member.name)} readOnly/>
                      </div>}
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {member.gender === "Male" ? <Male /> : <Female />}
                          <div className='font-semibold capitalize'>{member.name}</div>
                        </div>
                        <div className='flex text-xs leading-3 opacity-65'>
                          <div className='font-medium pr-1'>Parents:</div>
                          <div>{member.parentNames || "No parent information"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        }
        {error && <div className="p-6 text-center">{error}</div>}
        </div>

        {multiselect && <ButtonSolid buttonText='Submit' disabled={selectedValues.length <= 0} onClick={() => openList(false)} className='w-full absolute bottom-0 left-0 right-0 z-10 rounded-none'/>}
      </div>
    </>
  );
}
