'use client';

import { Cross, Female, FilterSelect, Male, SearchIcon, Tick } from '@/utils/Icons';
import { useEffect, useRef, useState } from 'react';
import Checkbox from '@/components/CheckBox';
import Input from '@/components/Input';
import { ButtonSolid } from './Button';
import { useToast } from '@/components/Toast';
import { useDebounce } from '@/utils/debounce';
import Container from './Container';
import { useAuth } from '@/contexts/AuthContext';

interface EachMember {
  id: number;
  name: string;
}
interface Member {
  id: number;
  name: string;
  gender: 'Male' | 'Female' | 'Letter';
  verified: boolean;
  father: EachMember | null;
  mother: EachMember | null;
  children: EachMember[];
  partner?: { name: string } | null;
  birthYear?: number;
  parentNames?: string;
}

enum ForType {
  SelectMember = 'selectMember',
  SelectPartner = 'selectPartner',
  SelectChildren = 'selectChildren',
  EditRelationship = 'editRelationship',
  EditMember = 'editMember'
}

function getFiltersFor(forType: 'selectMember' | 'selectChildren' | 'selectPartner' | 'editMember' | 'editRelationship', gender: string | null): string[] {
  switch (forType) {
    case ForType.SelectMember:
      return ['All Members'];
    case ForType.SelectPartner:
      return [gender === 'Male' ? 'Female' : 'Male', 'Partner Unassigned'];
    case ForType.SelectChildren:
      return ['Descendant', 'Parents Unassigned'];
    case ForType.EditRelationship:
      return ['Partner Assigned', 'Children Assigned'];
    case ForType.EditMember:
      return ['All Members']
    default:
      return ['All'];
  }
}

interface MemberListProps {
  forType: 'selectMember' | 'selectChildren' | 'selectPartner' | 'editRelationship' | 'editMember';
  gender?: 'Male' | 'Female' | null;
  excludeId?: number[] | null;
  setSelectedValue: (item: string, id: number, select: string, verified: boolean) => void;
  openList: any;
  getSelectedValues: any;
  multiselect: boolean;
  descendant: boolean | null;
}

export default function MemberList({
  forType = 'selectMember',
  gender = null,
  excludeId = null,
  descendant = null,
  setSelectedValue,
  openList,
  getSelectedValues,
  multiselect,
}: MemberListProps) {
  const toast = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<string[]>(getFiltersFor(forType, gender || null));
  const [searchInput, setSearchInput] = useState('');
  const [loadingList, setLoadingList] = useState(false);
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [mainMemberID, setMainMemberID] = useState(-1);
  const { logout } = useAuth();
  const [params, setParams] = useState({
    page: 1,
    limit: 25,
    search: '',
    type: forType,
    gender: gender,
    excludeId: excludeId,
    descendant: descendant,
    showCousin: false
  });

  const handleSetSearchFilter = useDebounce((value: string) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: value,
      page: 1,
    }));
    setHasMore(true);
  }, 900);

  const handleShowCousin = () => {
    setMembers([])
    setParams((prevParams) => ({
      ...prevParams,
      showCousin: !prevParams.showCousin,
      page: 1,
    }));
    setHasMore(true);
  }

  const handleMemberSearch = (input: string) => {
    setSearchInput(input);
    handleSetSearchFilter(input);
  };

  // const keyMap: { [key in ForType]: string } = {
  //   [ForType.SelectMember]: 'name',
  //   [ForType.SelectPartner]: 'partner',
  //   [ForType.SelectChildren]: 'children',
  //   [ForType.EditRelationship]: 'edit',
  //   [ForType.EditMember]: 'name',
  // };

  // const selectedValues = getSelectedValues[keyMap[forType]] || [];

  const selectedValues = getSelectedValues['children'] || [];



  useEffect(() => {
    // 1. Sync props to state and reset list if structural props changed
    // We compare props against the current params state
    const isStructuralChange =
      params.type !== forType ||
      params.gender !== gender ||
      params.descendant !== descendant ||
      JSON.stringify(params.excludeId) !== JSON.stringify(excludeId);

    if (isStructuralChange) {
      setParams((prev) => ({
        ...prev,
        type: forType,
        gender: gender,
        descendant: descendant,
        excludeId: excludeId,
        page: 1,
        search: '',
        showCousin: false,
      }));
      setSearchInput('');
      setMembers([]);
      setHasMore(true);
      setAppliedFilters(getFiltersFor(forType, gender));
      // Return early; the setParams call will trigger this effect again with synced values
      return;
    }

    // 2. Data fetching and scroll handling
    let isFetching = false;

    async function fetchMembers() {
      if (isFetching || hasMore === false) return;

      try {
        setLoadingList(true);
        isFetching = true;
        setError(null);

        const excludeIdSet = [...new Set(params.excludeId || [])];
        const response = await fetch(
          `/api?search=${encodeURIComponent(params.search)}&page=${params.page}&limit=${params.limit}&for=${params.type}&gender=${params.gender}&excludeId=${excludeIdSet}&descendant=${params.descendant}&showCousin=${params.showCousin}`,
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

        const { data, totalCount, mainMemberId } = await response.json();

        setMainMemberID(mainMemberId);
        if (params.page === 1) {
          setMembers(data);
        } else {
          setMembers((prev) => [...new Set([...prev, ...data])]);
        }
        const totalPages = Math.ceil(totalCount / params.limit);
        setHasMore(params.page < totalPages);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch members. Please try again later.');
        toast?.show(error.message || 'Failed to fetch members', 'error', 5000);
      } finally {
        setLoadingList(false);
        isFetching = false;
      }
    }

    fetchMembers();

    const handleScroll = () => {
      if (
        listContainerRef.current &&
        listContainerRef.current.scrollTop + listContainerRef.current.clientHeight >=
        listContainerRef.current.scrollHeight - 4 &&
        hasMore &&
        !isFetching
      ) {
        setParams((prevParams) => ({
          ...prevParams,
          page: prevParams.page + 1,
        }));
      }
    };

    const container = listContainerRef.current;
    container?.addEventListener('scroll', handleScroll);

    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [params, hasMore, toast, descendant, excludeId, gender, forType, logout]);
  // Do not add letterId in dependency for list to work properly

  const handleSelectedValue = (item: string, id: number, select: string, verified: boolean) => {
    setSelectedValue(item, id, select, verified);
  };

  const highlightSearchText = (text: string, searchText: string): string => {
    if (!searchText) return text;
    const regex = new RegExp(`(${searchText})`, 'gi');
    return text.replace(regex, '<span class="bg-accent_color text-accent_contrast">$1</span>');
  };

  const renderNoMembersMessage = () => {
    if (members.length === 0 && searchInput.length > 0) {
      return <p className="text-center pt-10 pb-4 px-2">No member found for &#39;{params.search}&#39;</p>;
    }
    switch (forType) {
      case (ForType.SelectMember || ForType.EditMember):
        return <p className="text-center pt-10 pb-4 px-2">No Member Available</p>;
      case ForType.SelectChildren:
        return <p className="text-center pt-10 pb-4 px-2">No family descendant with parents unassigned</p>;
      case ForType.SelectPartner:
        return params.showCousin ? (
          <p className="text-center pt-10 pb-4 px-2 loading-text">No family members with partner unassigned</p>
        ) : (
          <p className="text-center pt-10 pb-4 px-2 loading-text">No member with partner unassigned</p>
        );
      case ForType.EditRelationship:
        return <p className="text-center pt-10 pb-4 px-2">No member with partner/children assigned</p>;
      default:
        return null;
    }
  };

  return (
    <Container className="relative">
      <div className="border-b border-border_color bg-main_background z-10 relative">
        <div className="w-full p-3 border-b border-border_color">
          <div className="relative flex gap-2">
            <Input
              placeholder={
                forType === ForType.SelectPartner
                  ? 'Select partner'
                  : forType === ForType.SelectChildren
                    ? 'Select Children'
                    : 'Select Member'
              }
              className="pl-9"
              value={searchInput}
              onChange={(e) => handleMemberSearch(e.target.value)}
              type="text"
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <SearchIcon />
            </span>
          </div>
        </div>
        <ul className="py-2 px-3 flex gap-2 flex-nowrap overflow-x-auto scroll-stable">
          {appliedFilters?.map((item, index) => (
            <li key={index} className="py-1 pl-1 pr-4 text-xs border border-border_color bg-field_color rounded-full flex gap-1 items-center justify-between h-fit lg:h-auto">
              <FilterSelect />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        ref={listContainerRef}
        className={`${forType === ForType.SelectChildren && 'pb-14'} h-[60vh] md:h-[calc(100vh-9.625rem)] overflow-y-auto scroll-stable`}
      >
        {forType === ForType.SelectPartner && descendant === true && (
          <div className="py-2 px-4 flex justify-end items-center gap-2 bg-main_background text-sm border-b border-border_color">
            <p>Show Cousins List</p>
            <label className="relative inline-flex items-center cursor-pointer p-1">
              <span className="absolute left-[0.25rem] z-10">
                <Cross />
              </span>
              <input
                className="sr-only peer"
                type="checkbox"
                checked={params.showCousin}
                onChange={handleShowCousin}
              />
              <span className="absolute right-[0.25rem] z-10">
                <Tick />
              </span>
              <div className={`
              peer ring-1 bg-black ring-gray-600 rounded-full outline-none duration-300 after:duration-500 
              w-[1.96875rem] h-[0.875rem] peer-focus:outline-none after:content-[''] after:rounded-full after:absolute
              after:outline-none after:h-4 after:w-4 after:bg-main_background after:top-1/2 
              after:-translate-y-1/2 after:flex after:justify-center after:items-center 
              after:border-2 after:border-gray-600 
              ${params.showCousin ? 'after:translate-x-[1rem]' : 'after:translate-x-0'} 
            `} />
            </label>
          </div>
        )}
        {members.length > 0 ?
          <>
            {members.map((member) =>
              member.gender === 'Letter' ? (
                <div key={member.id} className="flex text-text_color items-center px-3 bg-main_background sticky top-0 z-10">
                  <span className="font-medium md:font-semibold pr-1">{member.name}</span>
                  <span className="border-t border-border_color block w-full"></span>
                </div>
              ) : (
                <div key={member.id} onClick={() => handleSelectedValue(member.name, member.id, forType, member.verified)} className="pl-4">
                  <div className="border-l border-border_color py-1 pl-4 pr-3">
                    <div className="cursor-pointer px-3 py-2 flex items-center border border-l-4 border-border_color bg-field_color rounded text-text_color">
                      {multiselect && (
                        <div className="pr-3 border-r border-border_color mr-2">
                          <Checkbox checked={selectedValues.some((value: EachMember) => value.id === member.id)} readOnly />
                        </div>
                      )}
                      <div>
                        <div className="flex gap-2">
                          <div>
                            {member.gender === 'Male' && <Male />}
                            {member.gender === 'Female' && <Female />}
                          </div>
                          <div
                            className="font-medium md:font-semibold"
                            dangerouslySetInnerHTML={{
                              __html: highlightSearchText(member.name, params.search),
                            }}
                          />
                        </div>
                        <div className="flex text-xs md:text-sm opacity-65 flex-wrap">
                          {member.id == mainMemberID ?
                            <span className='font-medium md:font-semibold'>Main Member</span>
                            : (member.father || member.mother ? (
                              <>
                                <span className="pr-1 font-medium md:font-semibold">Parents: </span>
                                {member.father && <span>{member.father.name}</span>}
                                {member.mother && <span>, {member.mother.name}</span>}
                              </>
                            ) : (member.partner) ? (
                              <div>
                                <span className="pr-1 font-medium md:font-semibold">Partner: </span>
                                <span>{member.partner.name}</span>
                              </div>
                            ) : (
                              'No family relationship assigned yet'
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
            <div className="min-h-10 px-4 py-2">
              {loadingList && <p className="py-2 px-4 text-text_color">Loading...</p>}
              {!loadingList && !hasMore && <p>, , ,</p>}
            </div>
          </>
          : loadingList ? <p className="py-4 text-center text-text_color loading-text">Loading....</p>
            : error ? <div className="p-6 text-center">{error}</div>
              : <div>{renderNoMembersMessage()}</div>}
      </div>

      {multiselect && <ButtonSolid buttonText={selectedValues.length <= 0 ? 'Close' : 'Submit'} onClick={() => openList((prev: any) => !prev)} className={`w-full absolute bottom-0 left-0 right-0 z-10 rounded-none mx-auto`} />}
    </Container>
  );
}
