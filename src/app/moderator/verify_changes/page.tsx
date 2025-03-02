'use client'

import { CloseIcon, SearchIcon } from "@/utils/Icons";
import { Call, Female, Male } from '@/utils/Icons';
import React, { useEffect, useRef, useState } from 'react'

import Link from 'next/link';
import Loading from '@/components/Loading';
import { useToast } from '@/components/Toast';
import Topnav from "@/components/Topnav";
import { useDebounce } from "@/utils/debounce";
import VerifyMemberDetails from "./Details";

export default function NewMembers() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [members, setMembers] = useState<any[] | never[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [memberDetails, setMemberDetails] = useState(null);
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
    setParams((prevParams) => ({
      ...prevParams,
      search: value,
      page: 1,
    }));
    setHasMore(true);
    setMembers([]);
  }, 900);

  const handleAssemblySearch = (input: string) => {
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

        const response = await fetch(`/api/relatives?search=${encodeURIComponent(params.search)}&page=${params.page}&limit=${params.limit}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const { data, totalCount } = await response.json();

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
  }, [params, hasMore, toast]);

  const handleShowDetails = async (member_id: string | number) => {
    try {
        setLoadingDetails(true)
        const response = await fetch(`/api/relatives/${member_id}`);
        if (!response.ok) throw new Error('Failed to fetch member details');

        const member = await response.json();

        setMemberDetails(member.data);
        setShowDetails(true);
    } catch (error:any) {
        if (toast) {
            toast.show(error.message || "Error fetching member details", "error", 5000);
        } else {
            alert(error.message || "Error fetching member details")
        }
    } finally {
      setLoadingDetails(false)
    }
  };

  function highlightText(text: string, searchText: string): string {
    if (!searchText) return text;
    const regex = new RegExp(`(${searchText})`, 'gi');
    return text.replace(regex, '<span class="bg-accent_color text-accent_contrast">$1</span>');
  }

  return (
    <div className="w-full">
      <Topnav>
      </Topnav>
      <div className="w-full md:flex">
        <div className='h-[calc(100vh-3rem)] overflow-y-auto scroll-stable w-full' ref={containerRef}>
          {!loadingList && !members ? (
          <p className='p-4'>No members found.</p>
          ) : 
          <div className='max-w-3xl'>
            <div className='max-w-xl mx-auto'>
              {members.map((member: any) => (
                member.gender === "Letter" ?
                <div key={member.id} className="flex text-text_color items-center px-[10px] md:pt-1 bg-main_background sticky top-0 z-10">
                  <span className="font-semibold pr-1">{member.name}</span>
                  <span className="border-t border-border_color block w-full"></span>
                </div> :
                <div key={member.id} className="pl-4">
                  <div className="border-l border-border_color md:pt-2 py-1 pl-4 pr-3">
                    <div 
                      onClick={() => handleShowDetails(member.id)} 
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
                        <p>Edit Member</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="h-10 px-4 py-2">
                {loadingList && <p className="text-text_color">Loading....</p>}
                {!loadingList && !hasMore && <p className="text-text_color">, , ,</p> }
              </div>
            </div>
          </div>}
        </div>
        <div
          onClick={() => setShowDetails(false)}
          className={`fixed md:hidden ${showDetails ? 'top-0 bg-gray-500/60' : 'bottom-full delay-300 bg-gray-300/5'} inset-0 z-[100] duration-500 ease-in-out`}
        />
        <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background ${showDetails ? 'md:border-l md:border-border_color z-[100] rounded-t-md md:rounded-none -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full lg:max-w-lg mx-auto md:h-[calc(100vh-3rem)]`}>
          <div className={`overflow-x-hidden ${showDetails ? 'visible md:delay-300 transition-all ease-in-out' : 'invisible'}`}>{loadingDetails ? <Loading /> : <VerifyMemberDetails data={memberDetails} openDetails={setShowDetails} />}</div>
        </div>
      </div>
    </div>
  );
}