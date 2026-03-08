'use client'

import { CloseIcon, Filter, SearchIcon, Verified } from "@/utils/Icons";
import { Female, Male } from '@/utils/Icons';
import React, { useEffect, useRef, useState } from 'react'
import { useToast } from '@/components/Toast';
import Topnav from "@/components/Topnav";
import { useDebounce } from "@/utils/debounce";
import NewMemberDetails from "./Details";
import { useAuth } from "@/contexts/AuthContext";
import { useInfiniteScroll } from "@/utils/useInfiniteScroll";
import SlidePanel from "@/components/SlidePanel";
import Container from "@/components/Container";
import Link from "next/link";

export default function VerifyMember() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [members, setMembers] = useState<any[] | never[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showDetailsFor, setShowDetailsFor] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [preparingList, setPreparingList] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Unverified');
  const { logout } = useAuth();
  const [params, setParams] = useState({
    page: 1,
    limit: 40,
    search: "",
    filter: "Unverified"
  });
  const [isFetching, setIsFetching] = useState(false);

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
    const fetchMembers = async () => {
      if (isFetching || !hasMore) return;

      try {
        setIsFetching(true);
        setLoadingList(true);

        const response = await fetch(`/api/moderator/verifyMember?search=${encodeURIComponent(params.search)}&page=${params.page}&limit=${params.limit}&filter=${params.filter}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            cache: 'no-store',
          }
        );

        // Handle 401 Unauthorized
        if (response.status === 401) {
          logout();
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
        setIsFetching(false);
      }
    };

    fetchMembers();
  }, [params, hasMore, logout, toast]);

  const loadMore = () => {
    if (hasMore) {
      setParams((prevParams) => ({ ...prevParams, page: prevParams.page + 1 }));
    }
  };

  useInfiniteScroll(
    containerRef,
    isFetching,
    hasMore,
    loadMore
  );

  function highlightText(text: string, searchText: string): string {
    if (!searchText) return text;
    const regex = new RegExp(`(${searchText})`, 'gi');
    return text.replace(regex, '<span class="bg-accent_color text-accent_contrast">$1</span>');
  }

  const handleShowDetails = (member: any) => {
    if (preparingList) return
    setShowDetailsFor(member);
    setShowDetails(true)
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
            className="peer p-1 block w-full pl-10 border border-border_color focus:outline-none font-normal rounded-md bg-main_background"
          />
          <button
            onClick={() => resetPrams()}
            className="absolute right-[0.5625rem] top-1/2 transform -translate-y-1/2 bg-main_background cursor-pointer block peer-placeholder-shown:hidden rounded-md"
            aria-label="Clear search"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Dropdown for Filtering Members */}
        <div className="relative">
          <button
            onClick={() => { setDropdownOpen(!dropdownOpen); setShowDetails(false) }}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)} // Fix: Delay for click handling
            className="py-1 px-1 sm:px-2 border border-border_color rounded-md bg-main_background flex justify-between w-auto sm:min-w-32">
            <span className="hidden sm:block">{selectedFilter}</span>
            <span><Filter /></span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-field_color border border-border_color shadow-md rounded-md overflow-hidden z-30">
              <div
                className="p-2 hover:bg-field_hover cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { handleFilterChange("All") }}>
                All
              </div>
              <div
                className="p-2 hover:bg-field_hover cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { handleFilterChange("Verified") }}>
                Verified
              </div>
              <div
                className="p-2 hover:bg-field_hover cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { handleFilterChange("Unverified") }}>
                Unverified
              </div>
            </div>
          )}
        </div>
      </Topnav>
      <div className="w-full md:flex">
        <Container className='scroll-stable' ref={containerRef}>
          <div className='max-w-3xl'>
            <div className='max-w-xl mx-auto'>
              <div className="bg-main_background w-full sticky pt-4 top-12 md:top-0 z-20 flex">
                <div className="border border-border_color -mb-3 rounded-md flex justify-center items-center shadow-sm ml-2 text-text_color bg-field_color whitespace-nowrap">
                  <Link href="/moderator" className="px-1 border-r border-border_color">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="1.25rem" height="1.25rem" viewBox="-8.5 0 32 32" version="1.1">
                      <path d="M15.281 7.188v17.594l-15.281-8.781z" />
                    </svg>
                  </Link>
                  <div className="px-2 py-0.5">
                    {selectedFilter} Members {params.search && '(Search)'}
                  </div>
                </div>
                <span className="border-b border-border_color block w-full mr-3"></span>
              </div>
              <div className="pt-3">
                {members?.map((member: any) => (
                  <div key={member.id} className="pl-4">
                    <div className="border-l border-border_color md:pt-2 pl-4 pr-3 py-1">
                      <div
                        onClick={() => { handleShowDetails(member) }}
                        className="cursor-pointer px-3 py-2 flex justify-between items-center border border-l-4 border-border_color bg-field_color rounded text-text_color"
                      >
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {member.gender === "Male" && <Male />}
                            {member.gender === "Female" && <Female />}
                            <div
                              className="font-medium md:font-semibold"
                              dangerouslySetInnerHTML={{
                                __html: highlightText(member.name, params.search),
                              }}
                            />
                          </div>
                          <div className="flex text-xs md:text-sm opacity-65 flex-wrap">
                            {(member.father || member.mother) ? (
                              <>
                                <span className="pr-1 font-medium md:font-semibold">Parents:</span>
                                {member.father && <span>{member.father.name}</span>}
                                {member.mother && <span>, {member.mother.name}</span>}
                              </>
                            ) : member.partner ? (
                              <div>
                                <span className="pr-1 font-medium md:font-semibold">Partner:</span>
                                <span>{member.partner.name}</span>
                              </div>
                            ) : 'No family relationship assigned yet'}
                          </div>
                        </div>
                        {params.filter == 'All' ? member.verified && <Verified /> : ''}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="min-h-10 px-4 py-2">
                  {loadingList && <p className="px-4 text-text_color">Loading...</p>}
                  {(!loadingList && members.length == 0) && (
                    params.search ? <p className='p-4 text-text_color'>No member found for &lsquo;{params.search}&lsquo;</p> : <p className='p-4'>No {selectedFilter} member available</p>
                  )}
                  {!hasMore && <p className="text-text_color">, , ,</p>}
                </div>
              </div>
            </div>
          </div>
        </Container>
        <SlidePanel setShowDetails={setShowDetails} showDetails={showDetails} >
          <NewMemberDetails
            showDetailsFor={showDetailsFor}
            setShowDetails={setShowDetails}
            setParams={setParams}
            handleMemberSearch={handleMemberSearch}
            preparingList={preparingList}
            setPreparingList={setPreparingList}
            setMembers={setMembers}
            members={members}
            selectedFilter={selectedFilter} />
        </SlidePanel>
      </div>
    </div>
  );
}