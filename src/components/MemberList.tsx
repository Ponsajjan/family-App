'use client';

import { Call, Female, FilterClose, FilterSelect, Male, SearchIcon } from '@/utils/Icons';
import React, { useEffect, useRef, useState } from 'react';
import Checkbox from '@/components/CheckBox';
import Input from '@/components/Input';
import { ButtonSolid } from './Button';
import Loading from './Loading';
import { useToast } from '@/components/Toast';
import Link from 'next/link';
import { useDebounce } from '@/utils/debounce';

interface EachMember {
  id: number;
  name: string;
}
interface Member {
  id: number;
  name: string;
  gender: 'Male' | 'Female';
  father: EachMember | null;
  mother: EachMember | null;
  children: EachMember[];
  partner?: EachMember | null;
  birthYear?: number;
  parentNames?: string;
}

interface MemberListProps {
  forType:  string // 'selectMember' | 'selectFather' | 'selectMother' | 'selectChildren';
  gender?: string | null;
  excludeId?: any;
  setSelectedValue: any;
  openList: any;
  getSelectedValues: any;
  multiselect: boolean;
  descendant: boolean | null;
}

export default function MemberList({ forType='selectMember', gender=null, excludeId=[], descendant=null, setSelectedValue, openList, getSelectedValues, multiselect }: MemberListProps) {
  const toast = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [showCousin, setShowCousin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<any[]>([])
  const [searchInput, setSearchInput] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const [switchingList, setSwitchingList] = useState(true)
  const [hasMore, setHasMore] = useState(true);
  const [params, setParams] = useState({
    page: 1,
    limit: 16,
    search: "",
  });

  const handleSetSearchFilter = useDebounce((value) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: value,
      page: 1,
    }));
    setSwitchingList(true)
    setMembers([])    
  }, 900);

  const handleAssemblySearch = (input: string) => {
    setSearchInput(input);
    handleSetSearchFilter(input);
  };

  // console.log('excludeId', excludeId)
  const keyMap:any = {
    selectMember: "name",
    selectPartner: "partner",
    selectChildren: "children",
  };

  const selectedValues = getSelectedValues[keyMap[forType]]
  
  useEffect(() => {
    setMembers([])
    setParams((prevParams) => ({
      ...prevParams,
      search: "",
      page: 1,
    }));
    setSearchInput("")
    setHasMore(true);
    setSwitchingList(true);
  }, [forType, showCousin]);

  useEffect(() => {
    function setFilteresUsed(forType: string) {
      switch (forType) {
        case 'selectMember':
          setAppliedFilters(['All Members']);
          break;
        case 'selectPartner':
          setAppliedFilters([gender === 'Male' ? 'Female' : 'Male', 'Partner Unassigned']);
          break;
        case 'selectChildren':
          setAppliedFilters(['Descendant', 'Parents Unassigned']);
          break;
        case 'editRelationship':
          setAppliedFilters(['Partner Assigned', 'Children Assigned']);
          break;
        default:
          setAppliedFilters(['All']);
          break;
      }
    }
    let isFetching = false; // Track ongoing fetch
    async function fetchMembers() {
      if (isFetching) return; // Prevent overlapping requests
      try {
        setLoadingList(true);
        isFetching = true;
        setError(null);
        
        const response = await fetch(
          `/api?search=${encodeURIComponent(params.search)}&page=${params.page}&limit=${params.limit}&for=${forType}&gender=${gender}&excludeId=${excludeId}&descendant=${descendant}&showCousin=${showCousin}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store', // Ensure no caching
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const { data, totalCount } = await response.json();
        
        // Append new data while avoiding duplicates
        setMembers((prev) => [...new Set([...prev, ...data])]);
  
        const totalPages = Math.ceil(totalCount / params.limit);
        setHasMore(params.page < totalPages);
      } catch (error: any) {
        if (toast) {
          toast.show(error.message || "Failed to fetch members", "error", 5000);
        } else {
          alert(error.message || "Failed to fetch members")
        }
        setError("Failed to fetch members. Please try again later.");
      } finally {
        setSwitchingList(false)
        setLoadingList(false);
        isFetching = false;
      }
    }

    setFilteresUsed(forType)
    fetchMembers();

    const handleScroll = () => {
      if (
        listContainerRef.current &&
        listContainerRef.current.scrollTop + listContainerRef.current.clientHeight >= listContainerRef.current.scrollHeight - 4 &&
        hasMore &&
        !isFetching
      ) {
        setParams((prevParams) => ({
          ...prevParams,
          page: prevParams.page + 1,
        }));
      }
    };

    const container = listContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
  
    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [forType, showCousin, params, hasMore, toast]);

  const handleSelectedValue = (item: string, id: number, select: string) => {
    setSelectedValue(item, id, select);
  };

  function highlightText(text: string, searchText: string): string {
    if (!searchText) return text; // Return the original text if no search term is provided
    const regex = new RegExp(`(${searchText})`, 'gi'); // Match search term case-insensitively
    return text.replace(regex, '<span class="bg-accent_color text-accent_contrast">$1</span>'); // Wrap matches with a span
  }

  return (
    <>
      <div className="relative bg-main_background">
        <div className='border-b border-border_color bg-main_background z-10 relative'>
          <div className="relative w-full p-3 border-b border-border_color">
            <div className='flex gap-2'>
              <Input
                placeholder={
                  forType === "selectMember" ? "Select Member To Edit" : 
                  forType === "selectPartner" ? "Select partner" : 
                  "Select Children"
                }  
                className="pl-9"
                value={searchInput}
                onChange={(e)=> handleAssemblySearch(e.target.value)}
                type="text"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <SearchIcon />
              </span>
            </div>
          </div>
          <ul className='py-2 px-3 flex gap-2 flex-nowrap overflow-x-auto min-h-[42px] scroll-stable'>
            {appliedFilters?.map((item, index) => 
              <li key={index} className='py-1 pl-1 pr-4 text-xs border border-border_color bg-field_color rounded-full flex gap-1 items-center justify-between'>
                <FilterSelect /><span>{item}</span>
              </li>
            )}
          </ul>
        </div>
        <div ref={listContainerRef} className={`${forType === 'selectChildren' && 'pb-14'} h-[60vh] md:h-[calc(100vh-154px)] overflow-y-auto scroll-stable`}>
          {(forType === 'selectPartner' && descendant === true) && 
          (<div className='py-2 px-4 flex justify-end items-center gap-2 bg-main_background text-sm border-b border-border_color'>
            <p>Show Cousins List</p>
            <label className="relative inline-flex items-center cursor-pointer p-1">
              <span className='absolute left-[5px] z-10'><FilterClose /></span>
              <input 
                  className="sr-only peer" 
                  type="checkbox" 
                  checked={showCousin} 
                  onChange={() => setShowCousin(prev => !prev)}
              />
              <span className='absolute right-[5px] z-10'><FilterSelect /></span>
              <div className="peer rounded-full outline-none duration-75 border border-border_color after:duration-100 w-9 h-[18px] bg-accent_color peer-focus:outline-none after:absolute after:outline-none after:rounded-full after:h-4 after:w-4 after:bg-white after:flex after:justify-center after:items-center after:font-bold peer-checked:after:translate-x-[18px] peer-checked:after:border-border_active" />
            </label>
          </div>)}
          {switchingList ? <Loading /> :
          !loadingList && !members ? (
            <p className='p-4'>No members found.</p>
          ) : members.length > 0 ?
            <>
              {members.map((member: any, index) => (
                member.gender === "Letter" ?
                <div key={index} className="flex text-text_color items-center px-3 bg-main_background sticky top-0 z-10 py-1">
                  <span className="font-semibold pr-1">{member.name}</span>
                  <span className="border-t border-border_color block w-full"></span>
                </div> :
                <div key={member.id} onClick = {() => handleSelectedValue(member.name, member.id, forType)} className="pl-4">
                  <div className="border-l border-border_color py-1 pl-4 pr-3">
                    <div className="cursor-pointer px-3 py-2 flex items-center border border-l-4 border-border_color bg-field_color rounded text-text_color">
                      {multiselect && <div className='pr-3 border-r border-border_color mr-2'>
                        <Checkbox checked={selectedValues.some((value:any) => value.id === member.id)} readOnly/>
                      </div>}
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {member.gender === "Male" && <Male /> }
                          {member.gender === "Female" && <Female />}
                          <div
                            className="font-semibold"
                            dangerouslySetInnerHTML={{
                            __html: highlightText(member.name, searchInput),
                          }}
                          />
                        </div>
                        <div className="flex text-xs md:text-sm opacity-65 flex-wrap gap-1">
                            {(member.father || member.mother) ? (
                            <>
                              <span className="pr-1 font-semibold">Parents: </span>
                              {member.father && <span className="pr-1">{member.father.name},</span>}
                              {member.mother && <span className="pr-1">{member.mother.name}</span>}
                            </>
                            ) : member.partner ? (
                            <div>
                              <span className="pr-1 font-semibold">Partner: </span>
                              <span className="pr-1">{member.partner.name}</span>
                            </div>
                            ) : 'No relationship assigned yet'}
                        </div>
                      </div>
                      {member.phoneNumber && (
                      <Link onClick={(e) => e.stopPropagation()} className="cursor-pointer" href={`tel:${member.phoneNumber}`}>
                        <Call />
                      </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="h-10 px-4 py-2">
                {loadingList && <p className="text-text_color">Loading....</p>}
                {!loadingList && !hasMore && <p>,,,</p> }
              </div>
            </> : error ?
            <div className="p-6 text-center">{error}</div> :
            <>
              {members.length == 0 && searchInput.length > 0 ? 
                <p className='text-center pt-10 pb-4 px-2'>No members found for '{params.search}'</p> :
                <>
                  {forType === 'selectChildren' && 
                    <p className='text-center pt-10 pb-4 px-2'>No family descendant with parents unassigned</p>}
                  {forType === 'selectPartner' && showCousin 
                    ? <p className='text-center pt-10 pb-4 px-2'>No family members with partner unassigned</p> 
                    : <p className='text-center pt-10 pb-4 px-2'>No member with partner unassigned</p>}
                  {forType === 'editRelationship' && 
                    <p className='text-center pt-10 pb-4 px-2'>No member with partner/children assigned</p>}
                </>}
              {forType === 'editRelationship' 
                ? <div className='mx-auto w-fit border border-border_color px-4 py-0.5 rounded-full font-medium mt-16'><Link href='/add_edit/add_relationship'> Add Relationship +</Link></div> 
                : <div className='mx-auto w-fit border border-border_color px-4 py-0.5 rounded-full font-medium mt-16'><Link href='/add_edit/add_member'> Add Member +</Link></div>}
            </>  
          }
        </div>

        {multiselect && <ButtonSolid buttonText={selectedValues.length <= 0 ? 'Close' : 'Submit'} onClick={() => openList((prev :any) => !prev)} className={`w-full absolute bottom-0 left-0 right-0 z-10 rounded-none ${selectedValues.length <= 0 ? 'opacity-45' : 'opacity-100'}`} />}
      </div>
    </>
  );
}