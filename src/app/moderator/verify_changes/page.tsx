'use client'

import { Female, Male } from '@/utils/Icons';
import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/components/Toast';
import Topnav from "@/components/Topnav";
import Details from './Details';
import { useAuth } from '@/contexts/AuthContext';
import { useInfiniteScroll } from '@/utils/useInfiniteScroll';
import SlidePanel from '@/components/SlidePanel';
import Container from '@/components/Container';
import Link from 'next/link';
import { appFetch } from "@/utils/appFetch";

export default function NewMembers() {
  const toast = useToast();
  const [changeList, setChangeList] = useState<any[] | never[]>([]);
  const [mainMemberId, setMainMemberId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const [showDetailsFor, setShowDetailsFor] = useState([]);
  const [currentDetailIndex, setCurrentDetailIndex] = useState<number>(0);
  const [memberId, setMemberId] = useState<number | null>(null)
  const { logout } = useAuth();
  const [params, setParams] = useState({
    page: 1,
    limit: 25,
  });
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchChangeList = async () => {
      if (!hasMore) return;

      // Guards against an older, slower response overwriting a newer page's
      // results when two fetches end up in flight at the same time.
      const requestId = ++requestIdRef.current;

      try {
        setIsFetching(true);
        setLoadingList(true);

        const response = await appFetch(`/api/moderator/verifyChange?page=${params.page}&limit=${params.limit}`,
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
        const { data, pagination, mainMemberId: fetchedMainMemberId } = await response.json();
        const totalCount = pagination?.totalCount ?? 0;

        if (requestId !== requestIdRef.current) return; // a newer request has since superseded this one

        setMainMemberId(fetchedMainMemberId ?? null);

        if (params.page === 1) {
          setChangeList(data);
        } else {
          setChangeList((prev) => {
            const seen = new Set(prev.map((c: any) => c.id));
            return [...prev, ...data.filter((c: any) => !seen.has(c.id))];
          });
        }

        const totalPages = Math.ceil(totalCount / params.limit);
        setHasMore(params.page < totalPages);
      } catch (error: any) {
        if (requestId === requestIdRef.current) {
          toast?.show(error.message || 'Failed to fetch members', 'error', 5000);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoadingList(false);
        }
        setIsFetching(false);
      }
    };

    fetchChangeList();
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

  const handleShowDetails = (value: any, id: number) => {
    if (disableButton) return;
    setShowDetails(true);
    setShowDetailsFor(value)
    setCurrentDetailIndex(0)
    setMemberId(id)
  }

  return (
    <div className="w-full">
      <Topnav>
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
                    Verify Changes
                  </div>
                </div>
                <span className="border-b border-border_color block w-full mr-3"></span>
              </div>
              <div className='pt-4'>
                {changeList?.map((member: any) => (
                  <div key={member.id} className="pl-4">
                    <div className="border-l border-border_color md:pt-2 pl-4 pr-3 py-1">
                      <div
                        onClick={() => handleShowDetails(member.pendingVerification, member.id)}
                        className="cursor-pointer px-3 py-2 flex justify-between items-center border border-l-4 border-border_color bg-field_color rounded text-text_color"
                      >
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {member.gender === "Male" && <Male />}
                            {member.gender === "Female" && <Female />}
                            <div className='font-medium'>{member.name}</div>
                          </div>
                          <div className="flex text-xs md:text-sm opacity-65 flex-wrap">
                            {member.id === mainMemberId ? (
                              <span className='font-medium'>Main Member</span>
                            ) : (member.father || member.mother) ? (
                              <>
                                <span className="pr-1 font-medium">Parents:</span>
                                {member.father && <span className='pr-1'>{member.father.name}, </span>}
                                {member.mother && <span>{member.mother.name}</span>}
                              </>
                            ) : member.partner ? (
                              <div>
                                <span className="pr-1 font-medium">Partner:</span>
                                <span>{member.partner.name}</span>
                              </div>
                            ) : 'No family relationship assigned yet'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="min-h-10 px-4 py-2">
                {loadingList && <p className="px-4 text-text_color">Loading...</p>}
                {(!loadingList && changeList.length === 0) &&
                  <p className='p-4'>No changes to verify</p>
                }
                {!hasMore && <p className="text-text_color">, , ,</p>}
              </div>
            </div>
          </div>
        </Container>
        <SlidePanel setShowDetails={setShowDetails} showDetails={showDetails} >
          <Details
            showDetailsFor={showDetailsFor}
            setShowDetails={setShowDetails}
            currentDetailIndex={currentDetailIndex}
            setCurrentDetailIndex={setCurrentDetailIndex}
            setShowDetailsFor={setShowDetailsFor}
            setChangeList={setChangeList}
            changeList={changeList}
            disableButton={disableButton}
            setDisableButton={setDisableButton}
            memberId={memberId}
          />
        </SlidePanel>
      </div>
    </div>
  );
}