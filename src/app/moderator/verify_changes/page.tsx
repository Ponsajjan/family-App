'use client'

import { Female, Male } from '@/utils/Icons';
import React, { useEffect, useRef, useState } from 'react'
import { useToast } from '@/contexts/ToastContext';
import Topnav from "@/components/Topnav";
import Details from './Details';
import { useAuth } from '@/contexts/AuthContext';

export default function NewMembers() {
  const toast = useToast();
  const [changeList, setChangeList] = useState<any[] | never[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [showDetailsFor, setShowDetailsFor] = useState([]);
  const [currentDetailIndex, setCurrentDetailIndex] = useState<number>(0);
  const [memberId, setMemberId] = useState<number | null>(null)
  const {logout} = useAuth();
  const [params, setParams] = useState({
    page: 1,
    limit: 25,
  });


  useEffect(() => {
    let isFetching = false;
    async function fetchChangeList() {
      if (isFetching) return;
      if (!hasMore) return;
      try {
        setLoadingList(true);
        isFetching = true;

        const response = await fetch(`/api/moderator/verifyChange?page=${params.page}&limit=${params.limit}`,
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
          setChangeList(data);
        } else {
          setChangeList((prev) => [...new Set([...prev, ...data])]);
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

    fetchChangeList();

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
  }, [params, hasMore, toast, logout]);

  const handleShowDetails = (value: any, id:number) => {
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
        <div className='h-[calc(100vh-3rem)] overflow-y-auto scroll-stable w-full' ref={containerRef}>
          <div className='max-w-3xl'>
            <div className='max-w-xl mx-auto'>
              <div className="bg-main_background w-full sticky pt-4 top-0 z-20 flex">
                <span className="border border-border_color -mb-3 rounded-md  shadow-sm px-2 py-0.5 ml-2 text-text_color bg-field_color whitespace-nowrap">Verify Changes</span>
                <span className="border-b border-border_color block w-full"></span>
              </div>
              <div className='pt-3'>
                {changeList?.map((member: any) => (
                  <div key={member.id} className="pl-4">
                    <div className="border-l border-border_color md:pt-2 py-1 pl-4 pr-3">
                      <div 
                        onClick={() => handleShowDetails(member.pendingVerification, member.id)} 
                        className="cursor-pointer px-3 py-2 flex justify-between items-center border border-l-4 border-border_color bg-field_color rounded text-text_color"
                      >
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {member.gender === "Male" && <Male /> }
                            {member.gender === "Female" && <Female />}
                            <div className='font-medium md:font-semibold'>{member.name}</div>
                          </div>
                          <div className="flex text-xs md:text-sm opacity-65 flex-wrap gap-1">
                              {(member.father || member.mother) ? (
                              <>
                                <span className="pr-1 font-medium md:font-semibold">Parents:</span>
                                {member.father && <span className="pr-1">{member.father.name},</span>}
                                {member.mother && <span className="pr-1">{member.mother.name}</span>}
                              </>
                              ) : member.partner ? (
                              <div>
                                <span className="pr-1 font-medium md:font-semibold">Partner:</span>
                                <span className="pr-1">{member.partner.name}</span>
                              </div>
                              ) : 'No family relationship assigned yet'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-10 px-4 py-2">
                {loadingList && <p className="p-4 text-text_color loading-text">Loading...</p>}
                {!hasMore && <p className="text-text_color">, , ,</p> }
              </div>
              {(!loadingList && changeList.length === 0) && 
                <p className='p-4 loading-text'>No changes to verify</p>
              }
            </div>
          </div>
        </div>
        <div
          onClick={() => setShowDetails(false)}
          className={`fixed md:hidden ${showDetails ? 'top-0 bg-gray-500/60' : 'bottom-full delay-300 bg-gray-300/5'} inset-0 z-[100] duration-500 ease-in-out`}
        />
        <div className={`md:static z-[101] fixed left-0 right-0 top-full bg-main_background ${showDetails ? 'md:border-l md:border-border_color z-[100] rounded-t-md md:rounded-none -translate-y-full md:translate-y-0' : 'md:w-0 translate-y-0 overflow-hidden'} transition-all duration-500 ease-in-out w-full h-[70vh] overflow-y-auto lg:max-w-[580px] mx-auto md:h-[calc(100vh-3rem)]`}>
          <div className={`overflow-x-hidden ${showDetails ? 'visible md:delay-300 transition-all ease-in-out' : 'invisible'}`}>
            <Details 
              showDetailsFor={showDetailsFor} 
              setShowDetails={setShowDetails} 
              currentDetailIndex={currentDetailIndex}
              setCurrentDetailIndex={setCurrentDetailIndex}
              setShowDetailsFor={setShowDetailsFor}
              setChangeList={setChangeList}
              memberId={memberId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}