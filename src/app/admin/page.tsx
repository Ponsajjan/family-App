'use client'

import { CloseIcon, SearchIcon } from "@/utils/Icons";
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useToast } from '@/components/Toast';
import Topnav from "@/components/Topnav";
import { useDebounce } from "@/utils/debounce";
import { useAuth } from "@/contexts/AuthContext";
import SlidePanel from "@/components/SlidePanel";
import { useRouter } from "next/navigation";
import Details from "./Details";
import { ApiResponse, AuthEntry } from "@/types/admin/types";

export default function Relatives() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMember, setSelectedMember] = useState<AuthEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [data, setData] = useState<AuthEntry[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const {logout, access} = useAuth();
  const [params, setParams] = useState({
    page: 1,
    limit: 25,
    search: "",
  });

  const handleSetSearchFilter = useDebounce((value: string) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: value,
      page: 1,
    }));
    setHasMore(true);
  }, 900);

  const handleMemberSearch = (input: string) => {
    setSearchInput(input);
    handleSetSearchFilter(input);
  };

  const fetchData = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
        ...(params.search && { search: params.search })
      });

      const response = await fetch(`/api/admin?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        logout();
        return;
      }

      const result: ApiResponse = await response.json();
      
      if (isLoadMore) {
        setData(prev => [...prev, ...result.data]);
      } else {
        setData(result.data);
      }
      
      setHasMore(result.pagination.hasNext);
    } catch (error: any) {
      toast?.show(error.message || 'Error fetching data', "error", 5000);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [params, logout, toast]);

  useEffect(() => {
    if (access !== "Admin") {
      toast?.show("You are not authorized to view this page", "error", 5000);
      logout();
      return;
    }
    fetchData();
  }, [fetchData, access, toast, logout]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const handleScroll = () => {
      if (loadingMore || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = currentContainer;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isAtBottom) {
        setParams(prev => ({
          ...prev,
          page: prev.page + 1
        }));
      }
    };

    currentContainer.addEventListener('scroll', handleScroll);
    return () => currentContainer.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore]);

  useEffect(() => {
    if (params.page > 1) {
      fetchData(true);
    }
  }, [params.page, fetchData]);

  function highlightText(text: string, searchText: string): string {
    if (!searchText) return text;
    const regex = new RegExp(`(${searchText})`, 'gi');
    return text.replace(regex, '<span class="bg-accent_color text-accent_contrast">$1</span>');
  }

  const handleShowDetails = (member: AuthEntry) => {
    setSelectedMember(member);
    setShowDetails(true);
  };

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
          <button onClick={() => handleMemberSearch('')} className="absolute right-[9px] top-1/2 transform -translate-y-1/2 bg-main_background cursor-pointer block peer-placeholder-shown:hidden rounded-md">
            <CloseIcon />
          </button>
        </div>
      </Topnav>
      <div className="w-full md:flex">
        <div className='h-[calc(100vh-3rem)] overflow-y-auto scroll-stable w-full pt-3' ref={containerRef}>
          <div className='max-w-3xl'>
            <div className='max-w-xl mx-auto'>
              {data?.map((row: AuthEntry, rowIndex: number) => (
                <div key={row.id || rowIndex} className="pl-4 pr-3">
                  <div className="py-0.5">
                    <div 
                      onClick={() => handleShowDetails(row)}
                      className="cursor-pointer px-3 py-2 flex justify-between items-center border border-l-4 border-border_color bg-field_color rounded text-text_color hover:bg-field_color/80 transition-colors"
                    >
                      <div className="w-full">
                        <div
                          className="md:font-medium md:text-lg"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(row.credential, params.search),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="h-10 px-4 py-2">
                {loading && <p className="px-4 text-text_color">Loading...</p>}
                {loadingMore && <p className="px-4 text-text_color">Loading more...</p>}
                {(!loading && data.length === 0 && !searchInput) && 
                  <p className="p-4 text-text_color">No credentials available</p>
                }
                {(!loading && data.length === 0 && searchInput) && 
                  <p className="p-4 text-text_color">No credentials found for &lsquo;{params.search}&lsquo;</p>
                }
                {!loading && !hasMore && data.length > 0 && <p className="text-text_color py-4">, , ,</p>}
              </div>
            </div>
          </div>
        </div>
        
        <SlidePanel setShowDetails={setShowDetails} showDetails={showDetails}>
          {selectedMember && (
            <Details selectedMember={selectedMember} />
          )}
        </SlidePanel>
      </div>
    </div>
  );
}