'use client'

import { CloseIcon, Filter, SearchIcon, Verified } from "@/utils/Icons";
import { Female, Male } from '@/utils/Icons';
import React, { useEffect, useRef, useState } from 'react'
import { useToast } from '@/components/Toast';
import Topnav from "@/components/Topnav";
import { useDebounce } from "@/utils/debounce";
import NewMemberDetails from "./Details";
import { getCookie } from 'cookies-next';
import { useRouter } from "next/navigation";

export default function VerifyMember() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [members, setMembers] = useState<any[] | never[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showDetailsFor, setShowDetailsFor] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Unverified');
  const token = getCookie('token');
  const router = useRouter();
  const [params, setParams] = useState({
    page: 1,
    limit: 30,
    search: "",
    filter: "Unverified"
  });

  const handleSetSearchFilter = useDebounce((value) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: value,
      filter: "All",
      page: 1,
    }));
    setSelectedFilter("All")
    setHasMore(true);
  }, 900);

  const resetPrams = () => {
    setParams((prevParams) => ({
      ...prevParams,
      search: "",
      page: 1,
    }));
    setSearchInput("");
    setHasMore(true);
  }

  const handleMemberSearch = (input: string) => {
    if (input == searchInput) return
    setSearchInput(input);
    handleSetSearchFilter(input);
  };

  useEffect(() => {
    let isFetching = false;
    async function fetchMembers() {
      if (isFetching) return;
      if (!hasMore) return;
      try {
        setLoadingList(true);
        isFetching = true;

        const response = await fetch(`/api/moderator/verifyMember?search=${encodeURIComponent(params.search)}&page=${params.page}&limit=${params.limit}&filter=${params.filter}`,
          {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            cache: 'no-store',
          }
        );

        // Handle 401 Unauthorized
        if (response.status === 401) {
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          router.push('/login');
          return;
        }
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const { data, totalCount } = await response.json();

        if (params.page === 1) {
          setMembers(data);
        } else {
          setMembers((prev) => [...new Set([...prev, ...data])]);
        }

        const totalPages = Math.ceil(totalCount / params.limit);
        setHasMore(params.page < totalPages);
      } catch (error: any) {
        toast?.show(error.message || 'Failed to fetch members', 'error', 5000);
      } finally {
        setLoadingList(false);
        isFetching = false;
      }
    }

    fetchMembers();

    const handleScroll = () => {
      if (
        containerRef.current &&
        containerRef.current.scrollTop + containerRef.current.clientHeight >= containerRef.current.scrollHeight - 4 &&
        hasMore &&
        !isFetching
      ) {
        setParams((prevParams) => ({
          ...prevParams,
          page: prevParams.page + 1,
        }));
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);

    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [params, hasMore, toast, token, router]);

  function highlightText(text: string, searchText: string): string {
    if (!searchText) return text;
    const regex = new RegExp(`(${searchText})`, 'gi');
    return text.replace(regex, '<span class="bg-accent_color text-accent_contrast">$1</span>');
  }

  const handleFilterChange = (value: string) => {
  if (value === selectedFilter) {
    setDropdownOpen(false);
    return;
  }
    setMembers([]);
    setSelectedFilter(value);
    setParams((prevParams) => ({
      ...prevParams,
      filter: value,
      page: 1,
    }));
    setHasMore(true);
    setDropdownOpen(false);
  };

  return (
    <div className="w-full">
      <Topnav>
        <div className="relative mr-0 ml-auto">
          <span className="absolute top-1/2 transform -translate-y-1/2 pointer-events-none px-2">
            <SearchIcon />
          </span>
          <input
            value={searchInput}
            onChange={(e) => handleMemberSearch(e.target.value)}
            type="text"
            placeholder="All Members"
            className="peer p-1 block w-[calc(100%-1px)] pl-10 border border-border_color focus:outline-none font-normal rounded-md bg-main_background"
          />
          <button onClick={() => resetPrams()} className="absolute right-[9px] top-1/2 transform -translate-y-1/2 bg-main_background cursor-pointer block peer-placeholder-shown:hidden rounded-md">
            <CloseIcon />
          </button>
        </div>
        
        {/* Dropdown for Filtering Members */}
        <div className="relative">
          <button 
            onClick={() => {setDropdownOpen(!dropdownOpen); setShowDetails(false)}}
            onBlur={() => setDropdownOpen(false)} 
            className="py-1 px-1 sm:px-2 border border-border_color rounded-md bg-main_background flex justify-between w-auto sm:min-w-32">
            <span className="hidden sm:block">{selectedFilter}</span>
            <span><Filter/></span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-field_color border border-border_color shadow-md rounded-md overflow-hidden">
              <div 
                className="p-2 hover:bg-field_hover cursor-pointer" 
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {handleFilterChange("All")}}>
                All
              </div>
              <div 
                className="p-2 hover:bg-field_hover cursor-pointer" 
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {handleFilterChange("Verified")}}>
                Verified
              </div>
              <div 
                className="p-2 hover:bg-field_hover cursor-pointer" 
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {handleFilterChange("Unverified")}}>
                Unverified
              </div>
            </div>
          )}
        </div>
      </Topnav>
      <div className="w-full md:flex">
        <div className='h-[calc(100vh-3rem)] overflow-y-auto scroll-stable w-full' ref={containerRef}>
          <div className='max-w-3xl'>
            <div className='max-w-xl mx-auto'>
              <>
                <div className="bg-main_background w-full sticky pt-4 top-0 z-20 flex">
                  <span className="border border-border_color -mb-3 rounded-md  shadow-sm px-2 py-0.5 ml-2 text-text_color bg-field_color whitespace-nowrap">{selectedFilter} Members</span>
                  <span className="border-b border-border_color block w-full"></span>
                </div>
                <div className="pt-3">
                  {members?.map((member: any) => (
                    <div key={member.id} className="pl-4">
                      <div className="border-l border-border_color md:pt-2 py-1 pl-4 pr-3">
                        <div 
                          onClick={() => {setShowDetailsFor(member); setShowDetails(true)}} 
                          className="cursor-pointer px-3 py-2 flex justify-between items-center border border-l-4 border-border_color bg-field_color rounded text-text_color"
                        >
                          <div>
                            <div className="flex flex-wrap gap-2">
                              {member.gender === "Male" && <Male /> }
                              {member.gender === "Female" && <Female />}
                              <div
                                className="font-semibold"
                                dangerouslySetInnerHTML={{
                                __html: highlightText(member.name, params.search),
                              }}
                              />
                            </div>
                            <div className="flex text-xs md:text-sm opacity-65 flex-wrap gap-1">
                                {(member.father || member.mother) ? (
                                <>
                                  <span className="pr-1 font-semibold">Parents:</span>
                                  {member.father && <span className="pr-1">{member.father.name},</span>}
                                  {member.mother && <span className="pr-1">{member.mother.name}</span>}
                                </>
                                ) : member.partner ? (
                                <div>
                                  <span className="pr-1 font-semibold">Partner:</span>
                                  <span className="pr-1">{member.partner.name}</span>
                                </div>
                                ) : 'No family relationship assigned yet'}
                            </div>
                          </div>
                          {params.filter == 'All' ? member.verified && <Verified/> : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="h-10 px-4 py-2">
                    {loadingList && <p className="p-4 text-text_color loading-text">Loading...</p>}
                    {!hasMore && <p className="text-text_color">, , ,</p> }
                  </div>
                  {(!loadingList && members.length == 0) && (
                    searchInput ? <p className='p-4 text-text_color'>No results found for '{params.search}'</p> : <p className='p-4 loading-text'>No data</p>
                  )}
                </div>
              </>
            </div>
          </div>
        </div>
        <div
          onClick={() => setShowDetails(false)}
          className={`fixed md:hidden ${showDetails ? 'top-0 bg-gray-500/60' : 'bottom-full delay-300 bg-gray-300/5'} inset-0 z-[100] duration-500 ease-in-out`}
        />
        <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background ${showDetails ? 'md:border-l md:border-border_color z-[100] rounded-t-md md:rounded-none -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full h-[60vh] overflow-y-auto lg:max-w-[580px] mx-auto md:h-[calc(100vh-3rem)]`}>
          <div className={`overflow-x-hidden ${showDetails ? 'visible md:delay-300 transition-all ease-in-out' : 'invisible'}`}><NewMemberDetails showDetailsFor={showDetailsFor} setShowDetails={setShowDetails} setParams={setParams} handleMemberSearch={handleMemberSearch} setMembers={setMembers} members={members} selectedFilter={selectedFilter}/></div>
        </div>
      </div>
    </div>
  );
}