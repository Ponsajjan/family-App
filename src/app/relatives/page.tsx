'use client'

import { CloseIcon, SearchIcon } from "@/utils/Icons";
import { Call, Female, Male } from '@/utils/Icons';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Details from './Details';
import Link from 'next/link';
import Loading from '@/components/Loading';
import { useToast } from '@/components/Toast';
import Topnav from "@/components/Topnav";
import { useDebounce } from "@/utils/debounce";
// import { revalidatePath } from 'next/cache';

// export const dynamic = "force-dynamic"
// export const revalidate = 0;

export default function Relatives() {
//   revalidatePath('/relatives');
  const toast = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [members, setMembers] = useState<any[] | never[]>([]);
  // Manage state for showing/hiding details
  const [showDetails, setShowDetails] = useState(false);
  const [userDetails, setUserDetails] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [params, setParams] = useState({
    page: 1,
    limit: 30,
    search: "",
  });

  const handleSetSearchFilter = useDebounce((value) => {
    setMembers([])    
    setParams((prevParams) => ({
      ...prevParams,
      search: value,
      page: 1,
    }));
  }, 900);

  const handleAssemblySearch = (input: string) => {
    setSearchInput(input);
    handleSetSearchFilter(input);
  };

  useEffect(() => {
    let isFetching = false; // Track ongoing fetch
    async function fetchUsers() {
      if (isFetching) return; // Prevent overlapping requests
      try {
        setLoadingList(true);
        isFetching = true;
  
        const response = await fetch(
          `/api/relatives?search=${encodeURIComponent(params.search)}&page=${params.page}&limit=${params.limit}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store', // Ensure no caching
          }
        );
  
        if (!response.ok) throw new Error('Network response was not ok');
  
        const { data, totalCount } = await response.json();
  
        // Append new data while avoiding duplicates
        setMembers((prev) => [...new Set([...prev, ...data])]);
  
        const totalPages = Math.ceil(totalCount / params.limit);
        setHasMore(params.page < totalPages);
      } catch (error: any) {
        toast?.show(error.message || 'Failed to fetch members', 'error', 5000);
      } finally {
        setLoadingList(false);
        isFetching = false;
      }
    }
  
    fetchUsers();
  
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
  }, [params]);
      
  // Optimize groupedUsers calculation
  const groupedUsers = useMemo(() => {
    return members.reduce((acc: Record<string, any[]>, user) => {
      const initial = user.name?.charAt(0).toUpperCase();
      if (!initial) return acc;
      acc[initial] = acc[initial] || [];
      acc[initial].push(user);
      return acc;
    }, {});
  }, [members]);

  const handleShowDetails = async (user_id: string | number) => {
    try {
        setLoadingDetails(true)
        const response = await fetch(`/api/relatives/${user_id}`);
        if (!response.ok) throw new Error('Failed to fetch user details');

        const user = await response.json();

        setUserDetails(user.data);
        setShowDetails(true);
    } catch (error:any) {
        if (toast) {
            toast.show(error.message || "Error fetching user details", "error", 5000);
        } else {
            alert(error.message || "Error fetching user details")
        }
    } finally {
      setLoadingDetails(false)
    }
  };

  function highlightText(text: string, searchText: string): string {
    if (!searchText) return text; // Return the original text if no search term is provided
    const regex = new RegExp(`(${searchText})`, 'gi'); // Match search term case-insensitively
    return text.replace(regex, '<span class="bg-accent_color text-accent_contrast">$1</span>'); // Wrap matches with a span
  }
  console.log('hihello', members)
  return (
    <div className="w-full">
      <Topnav>
        <div className="relative w-full ml-2">
          <input
            value={searchInput}
            onChange={(e)=> handleAssemblySearch(e.target.value)}
            type="text"
            placeholder="Search"
            className="ml-auto peer mr-0 input-not-placeholder block p-1 pl-4 border border-border_color focus:placeholder:text-text_color/55 placeholder:text-text_color/0 focus:outline-none w-9 ease-in-out duration-700 font-normal rounded-md  bg-main_background"
          />
          <span className="absolute right-[5px] top-1/2 transform -translate-y-1/2 bg-main_background pointer-events-none hidden peer-placeholder-shown:block">
            <SearchIcon />
          </span>
          <button onClick={() => handleAssemblySearch('')} className="absolute right-[9px] top-1/2 transform -translate-y-1/2 bg-main_background cursor-pointer block peer-placeholder-shown:hidden rounded-md">
            <CloseIcon />
          </button>
        </div>
      </Topnav>
      <div className="w-full md:flex">
        {/* Left panel: User List */}
        <div className='h-[calc(100vh-3rem)] overflow-y-auto scroll-stable w-full' ref={containerRef}>
          <div className='md:pt-4'></div>
          {!loadingList && !groupedUsers ? (
          <p className='p-4'>No members found.</p>
          ) : 
          <div className='max-w-3xl'>
            <div className='max-w-xl mx-auto'>
              {(Object.keys(groupedUsers).sort().map((letter) => (
                <div key={letter}>                                
                  <div className="flex text-text_color items-center px-3 bg-main_background sticky top-0 z-10 pb-1">
                    <span className="font-semibold pr-1 whitespace-nowrap">{letter}</span>
                    <span className="border-t border-border_color block w-full"></span>
                  </div>
                  {/* Render list of members */}
                  {groupedUsers[letter].map((user: any) => (
                    <div key={user.id} className="pl-4">
                      <div className="border-l border-border_color pt-1 pb-2 pl-4 pr-3">
                        <div 
                          onClick={() => handleShowDetails(user.id)} 
                          className="cursor-pointer px-3 py-2 flex justify-between items-center border border-l-4 border-border_color bg-field_color rounded text-text_color"
                        >
                          <div>
                            <div className="flex flex-wrap gap-2">
                              {user.gender === "Male" ? <Male /> : <Female />}
                              <div
                                className="font-semibold"
                                dangerouslySetInnerHTML={{
                                __html: highlightText(user.name, searchInput),
                              }}
                              />
                            </div>
                            <div className="flex text-xs md:text-sm opacity-65 flex-wrap gap-1">
                                {/* Render other details as usual */}
                                {(user.father || user.mother) ? (
                                <>
                                  <span className="pr-1 font-semibold">Parents:</span>
                                  {user.father && <span className="pr-1">{user.father.name},</span>}
                                  {user.mother && <span className="pr-1">{user.mother.name}</span>}
                                </>
                                ) : user.partner ? (
                                <div>
                                  <span className="pr-1 font-semibold">Partner:</span>
                                  <span className="pr-1">{user.partner.name}</span>
                                </div>
                                ) : 'No relationship assigned yet'}
                            </div>
                          </div>
                          {user.phoneNumber && (
                          <Link onClick={(e) => e.stopPropagation()} className="cursor-pointer" href={`tel:${user.phoneNumber}`}>
                            <Call />
                          </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )))}
              <div className="h-10 px-4 py-2">
                {loadingList && <p>Loading....</p>}
                {!loadingList && !hasMore && <p>,,,</p> }
              </div>
            </div>
          </div>}
        </div>
        <div
          onClick={() => setShowDetails(false)}
          className={`fixed md:hidden ${showDetails ? 'top-0 bg-gray-500/60' : 'bottom-full delay-300 bg-gray-300/5'} inset-0 z-[100] duration-500 ease-in-out`}
        />
        <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background ${showDetails ? 'md:border-l md:border-border_color z-[100] rounded-t-md md:rounded-none -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full lg:max-w-lg mx-auto overflow-y-auto`}>
          <div className={`overflow-x-hidden ${showDetails ? 'visible md:delay-300 transition-all ease-in-out' : 'invisible'}`}>{loadingDetails ? <Loading /> : <Details data={userDetails} openDetails={setShowDetails} />}</div>
        </div>
      </div>
    </div>
  );
}