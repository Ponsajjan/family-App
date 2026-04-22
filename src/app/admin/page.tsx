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
import { appFetch } from "@/utils/appFetch";

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

        const response = await appFetch(`/api/admin?${queryParams}`, {
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

  const [isGlobalActionLoading, setIsGlobalActionLoading] = useState<boolean>(false);

  const handleDownloadGlobalBackup = async () => {
    try {
      setIsGlobalActionLoading(true);
      const response = await appFetch(`/api/admin/backup`);
      if (!response.ok) throw new Error("Failed to generate global backup");

      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const date = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `GLOBAL_DATABASE_BACKUP_${date}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast?.show("Global backup downloaded successfully", "success", 5000);
    } catch (error: any) {
      toast?.show(error.message || "Failed to download global backup", "error", 5000);
    } finally {
      setIsGlobalActionLoading(false);
    }
  };

  const handleRestoreGlobalBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const backupData = JSON.parse(content);

        if (backupData.type !== "full") {
          throw new Error("This is not a full database backup file.");
        }

        if (!confirm("⚠️ CAUTION: You are about to restore the ENTIRE DATABASE. This will delete all current families, members, and credentials and replace them with the backup. This cannot be undone. Are you absolutely sure?")) {
          return;
        }

        setIsGlobalActionLoading(true);
        const response = await appFetch(`/api/admin/backup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(backupData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Global restore failed");
        }

        toast?.show("Database restored successfully", "success", 5000);
        window.location.reload();
      } catch (error: any) {
        toast?.show(error.message || "Invalid backup file", "error", 5000);
      } finally {
        setIsGlobalActionLoading(false);
        event.target.value = "";
      }
    };
    reader.readAsText(file);
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
            className="ml-auto peer mr-0 input-not-placeholder cursor-pointer block p-1 pl-4 focus:pr-8 border border-border_color focus:placeholder:text-text_color/55 placeholder:text-text_color/0 focus:outline-none w-9 ease-in-out duration-700 font-normal rounded-md bg-main_background"
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
              <div className="flex gap-2 mr-auto ml-0 mb-2">
                <button
                  onClick={handleDownloadGlobalBackup}
                  disabled={isGlobalActionLoading}
                  className="px-3 py-1 bg-field_color border border-border_color rounded-md hover:bg-field_hover transition-colors text-xs font-semibold whitespace-nowrap"
                >
                  Full DB Backup
                </button>
                <label className={`px-3 py-1 bg-field_color border border-border_color rounded-md hover:bg-field_hover transition-colors text-xs font-semibold whitespace-nowrap cursor-pointer ${isGlobalActionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  Full DB Restore
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleRestoreGlobalBackup}
                    disabled={isGlobalActionLoading}
                  />
                </label>
              </div>
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
                {(loading || isFetching) && <p className="px-4 text-text_color">Loading...</p>}
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
        {isGlobalActionLoading && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999]">
            <div className="bg-main_background border border-border_color px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
              <div className="w-4 h-4 border-2 border-accent_color border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-text_color">Processing Global Data...</span>
            </div>
          </div>
        )}


        <SlidePanel setShowDetails={setShowDetails} showDetails={showDetails}>
          {selectedCredential && (
            <Details
              selectedCredential={selectedCredential}
              onDelete={handleDelete}
              openDetails={setShowDetails}
            />
          )}
        </SlidePanel>
      </div>
    </div>
  );
}