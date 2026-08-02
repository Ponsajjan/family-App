'use client'

import { CloseIcon, SearchIcon, Filter } from "@/utils/Icons";
import { Call, Female, Male } from '@/utils/Icons';
import { useRef, useState, useMemo, useEffect } from 'react'
import useSWRInfinite from 'swr/infinite';
import Details from './Details';
import FilterPanel from './FilterPanel';
import Link from 'next/link';
import Topnav from "@/components/Topnav";
import { useDebounce } from "@/utils/debounce";
import SlidePanel from "@/components/SlidePanel";
import Container from "@/components/Container";
import { useInfiniteScroll } from '@/utils/useInfiniteScroll';
import { appFetch } from '@/utils/appFetch';
import PhoneCallPopup from '@/components/PhoneCallPopup';


export default function Relatives() {
  const [searchInput, setSearchInput] = useState("");
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMember, setShowMember] = useState<number | null>(null);
  const [phonePopup, setPhonePopup] = useState<string[] | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 40,
    search: "",
  });

  const [filters, setFilters] = useState<{
    occupation: string[];
    education: string[];
    birthPlace: string[];
    country: string;
    state: string;
    district: string;
    city: string;
    birthYearStart: string;
    birthYearEnd: string;
    family: number[];
  }>({
    occupation: [],
    education: [],
    birthPlace: [],
    country: '',
    state: '',
    district: '',
    city: '',
    birthYearStart: '',
    birthYearEnd: '',
    family: []
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.occupation && filters.occupation.length > 0) count++;
    if (filters.education && filters.education.length > 0) count++;
    if (filters.birthPlace && filters.birthPlace.length > 0) count++;
    if (filters.country) count++;
    if (filters.state) count++;
    if (filters.district) count++;
    if (filters.city) count++;
    if (filters.birthYearStart || filters.birthYearEnd) count++;
    if (filters.family && filters.family.length > 0) count++;
    return count;
  }, [filters]);

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
    setParams(prev => ({
      ...prev,
      search: "",
      page: 1,
    }));
  };

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.data.length) return null;
    return `/api/relatives?search=${encodeURIComponent(params.search)}&page=${pageIndex + 1}&limit=${params.limit}&filters=${encodeURIComponent(JSON.stringify(filters))}`;
  };

  const {
    data: swrData,
    size,
    setSize,
    isLoading,
    isValidating,
    error,
    mutate
  } = useSWRInfinite(getKey, { shouldRetryOnError: false });

  useEffect(() => {
    // Only check version if data is present at the moment params change (from SWR cache)
    if (swrData?.[0]?._version) {
      const checkRelativesVersion = async () => {
        const currentVersion = JSON.stringify(swrData[0]._version);

        try {
          const res = await appFetch(`/api/auth/versionCheck/relatives?page=1&limit=${params.limit}&search=${encodeURIComponent(params.search)}&version=${encodeURIComponent(currentVersion)}`);
          if (res.ok) {
            const result = await res.json();
            if (result.mismatch) {
              console.log(`[VersionCheck] Stale data detected for relatives. Updating...`);
              const { clearPWACaches } = await import("@/utils/pwaCache");
              await clearPWACaches();

              // Update the first page of the infinite cache
              await mutate((prev) => {
                if (!prev) return prev;
                const next = [...prev];
                next[0] = result.data;
                return next;
              }, false);
            }
          }
        } catch (err) {
          console.error("[Relatives] Version check failed:", err);
        }
      };
      checkRelativesVersion();
    }
  }, [params.search, params.limit, mutate]);

  const members = useMemo(() => {
    if (!swrData) return [];
    const allMembers = swrData.flatMap((page) => page.data);
    // Remove duplicates based on ID if any
    const seen = new Set();
    return allMembers.filter((member) => {
      const duplicate = seen.has(member.id);
      seen.add(member.id);
      return !duplicate;
    });
  }, [swrData]);

  const hasMore = useMemo(() => {
    if (!swrData) return true;
    const lastPage = swrData[swrData.length - 1];
    const totalCount = lastPage.totalCount || 0;
    return members.length < totalCount;
  }, [swrData, members]);

  const loadingList = isLoading || (size > 0 && !error && swrData && typeof swrData[size - 1] === "undefined");
  const isFetching = isValidating;

  const loadMore = () => {
    if (hasMore && !isFetching) {
      setSize(size + 1);
    }
  };

  useInfiniteScroll(containerRef, isFetching, hasMore, loadMore);

  function highlightText(text: string, searchText: string): string {
    if (!searchText) return text;
    // Escape special regex characters like dots to treat them as literals
    const escapedSearchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearchText})`, 'gi');
    return text.replace(regex, '<span class="bg-accent_color text-accent_contrast">$1</span>');
  }

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);

    const hasActiveFilters = Object.values(newFilters).some(v => Array.isArray(v) ? v.length > 0 : v !== '');
    if (hasActiveFilters) {
      setSearchInput("");
      setParams(prev => ({
        ...prev,
        search: "",
        page: 1,
      }));
    }
  };
  const handleSetDetails = (value: boolean) => {
    if (value) {
      setShowSidePanel(true);
      setShowDetails(true);
      setShowFilters(false);
    } else {
      setShowSidePanel(false);
      setShowDetails(false);
    }
  };

  const handleSetFilter = (value: boolean) => {
    if (value) {
      setShowSidePanel(true);
      setShowFilters(true);
      setShowDetails(false);
    } else {
      setShowSidePanel(false);
      setShowFilters(false);
    }
  };


  return (
    <div className="w-full">
      <Topnav>
        <div className="flex items-center gap-2 ml-auto mr-0">
          <div className="relative w-full md:w-64">
            <label htmlFor="relatives-search" className="sr-only">Search members by name</label>
            <input
              id="relatives-search"
              value={searchInput}
              onChange={(e) => handleMemberSearch(e.target.value)}
              type="text"
              placeholder="Search by name"
              aria-label="Search members by name"
              className="ml-auto peer mr-0 input-not-placeholder cursor-pointer block p-1 pl-4 focus:pr-8 border border-border_color focus:placeholder:text-text_color/55 placeholder:text-text_color/0 focus:outline-none w-9 ease-in-out duration-700 font-normal rounded-md bg-main_background"
            />
            <span className="absolute right-[0.3125rem] top-1/2 transform -translate-y-1/2 bg-main_background pointer-events-none hidden peer-placeholder-shown:block" aria-hidden="true">
              <SearchIcon />
            </span>
            <button
              onClick={resetSearch}
              className="absolute right-[0.5625rem] top-1/2 transform -translate-y-1/2 bg-main_background cursor-pointer block peer-placeholder-shown:hidden rounded-md"
              aria-label="Clear search"
            >
              <CloseIcon aria-hidden="true" />
            </button>
          </div>
          <button
            onClick={() => handleSetFilter(true)}
            className={`p-1 border border-border_color rounded-md bg-main_background md:hover:bg-field_color relative ${activeFilterCount > 0 ? 'border-border_active shadow-sm' : ''}`}
            aria-label="Toggle filters"
          >
            <Filter />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-border_active text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </Topnav>
      <div className="w-full md:flex">
        <Container className='scroll-stable' ref={containerRef}>
          <div className='max-w-3xl'>
            <div className='max-w-xl mx-auto' role="list" aria-label="Family members">
              {members?.map((member: any) => (
                member.gender === "Letter" ?
                  <div key={member.id} role="listitem" className="flex text-text_color items-center px-[0.625rem] md:pt-1 bg-main_background sticky top-12 md:top-0 z-10">
                    <span className="font-medium pr-1">{member.name}</span>
                    <span className="border-t border-border_color block w-full" aria-hidden="true"></span>
                  </div> :
                  <div key={member.id} role="listitem" className="pl-4">
                    <div className="border-l border-border_color md:pt-2 pl-4 pr-3 py-1">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => { handleSetDetails(true); setShowMember(member.id) }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSetDetails(true); setShowMember(member.id); } }}
                        aria-label={`View details for ${member.name}`}
                        className="cursor-pointer px-3 py-2 flex justify-between items-center border border-l-4 border-border_color bg-field_color rounded text-text_color"
                      >
                        <div>
                          <div className="flex gap-2">
                            <div aria-label={member.gender} role="img">
                              {member.gender === "Male" && <Male aria-hidden="true" />}
                              {member.gender === "Female" && <Female aria-hidden="true" />}
                            </div>
                            <div
                              className="font-medium"
                              dangerouslySetInnerHTML={{
                                __html: highlightText(member.name, params.search),
                              }}
                            />
                          </div>
                          <div className="flex text-xs md:text-sm opacity-65 flex-wrap">
                            {(member.father || member.mother) ? (
                              <>
                                <span className="pr-0.5 font-medium">Parents:</span>
                                {member.father && <span className='pr-1'>{member.father.name}, </span>}
                                {member.mother && <span>{member.mother.name}</span>}
                              </>
                            ) : member.partner ? (
                              <div>
                                <span className="pr-0.5 font-medium">Partner:</span>
                                <span>{member.partner.name}</span>
                              </div>
                            ) : 'No family relationship assigned yet'}
                          </div>
                        </div>
                        {member.phoneNumber && (() => {
                          const nums = member.phoneNumber.split(',').map((n: string) => n.trim()).filter(Boolean);
                          if (nums.length > 1) {
                            return (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setPhonePopup(nums); }}
                                className="cursor-pointer"
                                aria-label="Choose phone number"
                              >
                                <Call />
                              </button>
                            );
                          }
                          return (
                            <Link onClick={(e) => e.stopPropagation()} className="cursor-pointer" href={`tel:${nums[0]}`}>
                              <Call />
                            </Link>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
              ))}
              <div className="min-h-10 px-4 py-2">
                {loadingList && <p className="px-4 text-text_color">Loading...</p>}
                {(!loadingList && members.length === 0) && (
                  error ?
                    <p className="p-4 text-text_color w-full">{error.message}</p> :
                    (params.search && activeFilterCount > 0) ? <p className="p-4 text-text_color w-full">No member found for the current search and filters.</p> :
                      params.search ? <p className="p-4 text-text_color w-full overflow-hidden text-ellipsis">No member found for "{params.search}".</p> :
                        activeFilterCount > 0 ? <p className="p-4 text-text_color w-full">No member found for the current filters.</p> : ''
                )}
                {!loadingList && error && members.length > 0 && <p className="px-4 text-text_color w-full">{error.message}</p>}
                {!hasMore && !error && members.length > 0 && <p className="text-text_color">, , ,</p>}
              </div>
            </div>
          </div>
        </Container>

        {/* Side Panel for Details and Filters */}
        <SlidePanel setShowDetails={setShowSidePanel} showDetails={showSidePanel} >
          <Details showDetails={showDetails} showMember={showMember} openDetails={setShowSidePanel} />
          <FilterPanel
            showFilters={showFilters}
            onClose={() => setShowSidePanel(false)}
            onApply={handleApplyFilters}
            currentFilters={filters}
          />
        </SlidePanel>
      </div>

      {phonePopup && <PhoneCallPopup numbers={phonePopup} onClose={() => setPhonePopup(null)} />}
    </div>
  );
}
