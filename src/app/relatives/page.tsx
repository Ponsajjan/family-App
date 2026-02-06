'use client'

import { CloseIcon, SearchIcon } from "@/utils/Icons";
import { Call, Female, Male } from '@/utils/Icons';
import { useEffect, useRef, useState, useCallback } from 'react'
import Details from './Details';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import Topnav from "@/components/Topnav";
import { useDebounce } from "@/utils/debounce";
import { useAuth } from "@/contexts/AuthContext";
import SlidePanel from "@/components/SlidePanel";
import Container from "@/components/Container";
import { useInfiniteScroll } from '@/utils/useInfiniteScroll';
import { useGetRelativesQuery } from '@/store/services/membersApi';
import { Member } from '@/types/member';

export default function Relatives() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showMember, setShowMember] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { logout } = useAuth();
  const [params, setParams] = useState({
    page: 1,
    limit: 40,
    search: "",
  });

  const { data, isLoading, isFetching, error, refetch } = useGetRelativesQuery(params);

  const members = data?.data || [];
  const hasMore = data ? members.length < data.totalCount : true;

  const handleSetSearchFilter = useDebounce((value) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: value,
      page: 1,
    }));
  }, 900);

  const handleMemberSearch = (input: string) => {
    setSearchInput(input);
    handleSetSearchFilter(input);
  };

  const resetSearch = () => {
    setSearchInput("");
    setParams({
      search: "",
      page: 1,
      limit: 40,
    });
  };

  useEffect(() => {
    if (error) {
      const message = (error as any)?.data?.message || 'Failed to fetch members';
      toast?.show(message, 'error', 5000);
      if ((error as any)?.status === 401) {
        logout();
      }
    }
  }, [error, toast, logout]);

  const loadMore = () => {
    if (hasMore && !isFetching) {
      setParams((prevParams) => ({ ...prevParams, page: prevParams.page + 1 }));
    }
  };

  useInfiniteScroll(
    containerRef,
    isFetching,
    hasMore,
    loadMore,
  );

  function highlightText(text: string, searchText: string): string {
    if (!searchText) return text;
    const regex = new RegExp(`(${searchText})`, 'gi');
    return text.replace(regex, '<span class="bg-accent_color text-accent_contrast">$1</span>');
  }

  return (
    <div className="w-full">
      <Topnav>
        <div className="relative w-full md:w-64 ml-auto mr-0">
          <input
            value={searchInput}
            onChange={(e) => handleMemberSearch(e.target.value)}
            type="text"
            placeholder="Search"
            className="ml-auto peer mr-0 input-not-placeholder cursor-pointer block p-1 pl-4 border border-border_color focus:placeholder:text-text_color/55 placeholder:text-text_color/0 focus:outline-none w-9 ease-in-out duration-700 font-normal rounded-md bg-main_background"
          />
          <span className="absolute right-[5px] top-1/2 transform -translate-y-1/2 bg-main_background pointer-events-none hidden peer-placeholder-shown:block">
            <SearchIcon />
          </span>
          <button
            onClick={resetSearch}
            className="absolute right-[9px] top-1/2 transform -translate-y-1/2 bg-main_background cursor-pointer block peer-placeholder-shown:hidden rounded-md"
            aria-label="Clear search"
          >
            <CloseIcon />
          </button>
        </div>
      </Topnav>
      <div className="w-full md:flex">
        <Container className='scroll-stable' ref={containerRef}>
          <div className='max-w-3xl'>
            <div className='max-w-xl mx-auto'>
              {members?.map((member: any) => (
                member.gender === "Letter" ?
                  <div key={member.id} className="flex text-text_color items-center px-[10px] md:pt-1 bg-main_background sticky top-12 md:top-0 z-10">
                    <span className="font-medium md:font-semibold pr-1">{member.name}</span>
                    <span className="border-t border-border_color block w-full"></span>
                  </div> :
                  <div key={member.id} className="pl-4">
                    <div className="border-l border-border_color md:pt-2 pl-4 pr-3 py-1">
                      <div
                        onClick={() => { setShowDetails(true); setShowMember(member.id) }}
                        className="cursor-pointer px-3 py-2 flex justify-between items-center border border-l-4 border-border_color bg-field_color rounded text-text_color"
                      >
                        <div>
                          <div className="flex gap-2">
                            <div>
                              {member.gender === "Male" && <Male />}
                              {member.gender === "Female" && <Female />}
                            </div>
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
                                <span className="pr-0.5 font-medium md:font-semibold">Parents:</span>
                                {member.father && <span>{member.father.name}</span>}
                                {member.mother && <span>, {member.mother.name}</span>}
                              </>
                            ) : member.partner ? (
                              <div>
                                <span className="pr-0.5 font-medium md:font-semibold">Partner:</span>
                                <span>{member.partner.name}</span>
                              </div>
                            ) : 'No family relationship assigned yet'}
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
              <div className="min-h-10 px-4 py-2">
                {(isLoading || isFetching) && <p className="px-4 text-text_color">Loading...</p>}
                {(!isLoading && !isFetching && members.length === 0) && (
                  params.search ? <p className="p-4 text-text_color">No member found for &lsquo;{params.search}&lsquo;</p> : ''
                )}
                {!hasMore && members.length > 0 && <p className="text-text_color">, , ,</p>}
              </div>
            </div>
          </div>
        </Container>
        <SlidePanel setShowDetails={setShowDetails} showDetails={showDetails} >
          <Details showMember={showMember} openDetails={setShowDetails} />
        </SlidePanel>
      </div>
    </div>
  );
}
