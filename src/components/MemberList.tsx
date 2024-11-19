'use client';

import { Female, Filter, FilterClose, FilterSelect, Male, SearchIcon } from '@/utils/Icons';
import React, { useEffect, useState } from 'react';
import Container from "@/components/Container";
import Checkbox from '@/components/CheckBox';
import Input from '@/components/Input';
import { ButtonSolid } from './Button';
import Loading from './Loading';

interface User {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  partner?: boolean;
  birthYear?: number;
  parentNames?: string;
}

interface MemberListProps {
  forType:  string // 'selectUser' | 'selectFather' | 'selectMother' | 'selectChildren';
  birthYearThreshold?: number;  // Only required for 'selectChildren' case
}

export default function MemberList({ forType, birthYearThreshold }: MemberListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [multiselect, setMultiSelect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<any[]>([])

  useEffect(() => {
    function setFilteresUsed(forType: string) {
      switch (forType) {
        case 'selectUser':
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
    
    async function fetchUsers() {
      try {
        setLoading(true)
        setUsers([])
        setMultiSelect(forType === "selectChildren")
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

        const usersData: User[] = await response.json();
        const sortedUsers = usersData.sort((a, b) => a.name.localeCompare(b.name));
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Failed to fetch members:", error);
        setError("Failed to fetch members. Please try again later.");
      } finally {
        setLoading(false)
      }
    }

    setFilteresUsed(forType)
    fetchUsers();
  }, [forType, birthYearThreshold]);

  const groupedUsers = users.reduce<{ [key: string]: User[] }>((acc, user) => {
    const letter = user.name.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(user);
    return acc;
  }, {});

  return (
    <>
      <div className="relative">
        <div className='border-b border-border_color bg-main_background z-10 relative'>
          <div className="relative w-full p-3 border-b border-border_color">
            <div className='flex gap-2'>
              <Input placeholder={forType} className="pl-9" />
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

        <div className='pb-14 h-[60vh] md:h-[calc(100vh-161px)] overflow-y-auto'>
        {loading ? 
          <Loading /> :
          Object.keys(groupedUsers).sort().map((letter) => (
            <div key={letter}>
              <div className="flex text-text_color items-center mx-3 bg-main_background sticky top-0 z-[9]">
                <span className="font-semibold pr-1 whitespace-nowrap">{letter}</span>
                <span className="border-t border-border_color block w-full"></span>
              </div>

              {groupedUsers[letter].map((user) => (
                <div key={user.id} className="pl-4">
                  <div className="border-l border-border_color py-1 pl-4 pr-3">
                    <div className="cursor-pointer px-3 py-2 flex items-center border border-border_color bg-field_color rounded text-text_color">
                      {multiselect && <div className='pr-3 border-r border-border_color mr-2'>
                        <Checkbox name="selected" />
                      </div>}
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {user.gender === "Male" ? <Male /> : <Female />}
                          <div className='font-semibold capitalize'>{user.name}</div>
                        </div>
                        <div className='flex text-xs leading-3 opacity-65'>
                          <div className='font-medium pr-1'>Parents:</div>
                          <div>{user.parentNames || "No parent information"}</div>
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

        {multiselect && <ButtonSolid buttonText='Submit' className='w-full absolute bottom-0 left-0 right-0 z-10 rounded-none'/>}
      </div>
    </>
  );
}
