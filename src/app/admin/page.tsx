'use client'

import { CloseIcon, SearchIcon } from "@/utils/Icons";
import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/components/Toast';
import Topnav from "@/components/Topnav";
import { useDebounce } from "@/utils/debounce";
import { useAuth } from "@/contexts/AuthContext";
import { useInfiniteScroll } from "@/utils/useInfiniteScroll";
import SlidePanel from "@/components/SlidePanel";
import Details from "./Details";
import { ApiResponse, AuthEntry } from "@/types/admin/types";
import Container from "@/components/Container";

export default function Relatives() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<AuthEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<AuthEntry[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { logout } = useAuth();
  const [params, setParams] = useState({
    page: 1,
    limit: 25,
    search: "",
  });
  const [isFetching, setIsFetching] = useState<boolean>(false);

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

  const resetSearch = () => {
    setSearchInput("");
    setData([]);
    setParams(prev => ({
      ...prev,
      search: "",
      page: 1,
    }));
    setHasMore(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isFetching || !hasMore) return;

      try {
        setIsFetching(true);
        setLoading(true);

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

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const { data, totalCount }: ApiResponse = await response.json();
        if (params.page === 1) {
          setData(data);
        } else {
          setData(prev => [...prev, ...data]);
        }

        const totalPages = Math.ceil(totalCount / params.limit);
        setHasMore(params.page < totalPages);
      } catch (error: any) {
        toast?.show(error.message || 'Error fetching data', "error", 5000);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchData();
  }, [params, toast, logout]);

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

  const handleShowDetails = (credential: AuthEntry) => {
    setSelectedCredential(credential);
    setShowDetails(true);
  };

  const handleDelete = (id: number) => {
    setData(prev => prev.filter(item => item.id !== id));
    setShowDetails(false);
    setSelectedCredential(null);
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
          <span className="absolute right-[0.3125rem] top-1/2 transform -translate-y-1/2 bg-main_background pointer-events-none hidden peer-placeholder-shown:block">
            <SearchIcon />
          </span>
          <button
            onClick={resetSearch}
            className="absolute right-[0.5625rem] top-1/2 transform -translate-y-1/2 bg-main_background cursor-pointer block peer-placeholder-shown:hidden rounded-md"
            aria-label="Clear search"
          >
            <CloseIcon />
          </button>
        </div>
      </Topnav>
      <div className="w-full md:flex">
        <Container className='scroll-stable pt-3' ref={containerRef}>
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
                          dangerouslySetInnerHTML={{
                            __html: highlightText(row.mainMemberName, params.search),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="min-h-10 px-4 py-2">
                {loading || isFetching && <p className="px-4 text-text_color">Loading...</p>}
                {(!loading && data.length === 0 && !params.search) &&
                  <p className="p-4 text-text_color">No credentials available</p>
                }
                {(!loading && data.length === 0 && params.search) &&
                  <p className="p-4 text-text_color">No credentials found for &lsquo;{params.search}&lsquo;</p>
                }
                {!loading && !hasMore && data.length > 0 && <p className="text-text_color py-4">, , ,</p>}
              </div>
            </div>
          </div>
        </Container>

        <SlidePanel setShowDetails={setShowDetails} showDetails={showDetails}>
          {selectedCredential && (
            <Details
              selectedCredential={selectedCredential}
              onDelete={handleDelete}
            />
          )}
        </SlidePanel>
      </div>
    </div>
  );
}