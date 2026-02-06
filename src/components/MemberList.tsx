'use client';

import { Cross, Female, FilterSelect, Male, SearchIcon, Tick } from '@/utils/Icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import Checkbox from '@/components/CheckBox';
import Input from '@/components/Input';
import { ButtonSolid } from './Button';
import { useToast } from '@/components/Toast';
import { useDebounce } from '@/utils/debounce';
import Container from './Container';
import { useAuth } from '@/contexts/AuthContext';
import { useGetMembersQuery } from '@/store/services/membersApi';
import { EachMember, Member } from '@/types/member';

enum ForType {
  SelectMember = 'selectMember',
  SelectPartner = 'selectPartner',
  SelectChildren = 'selectChildren',
  EditRelationship = 'editRelationship',
  EditMember = 'editMember'
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
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const { logout } = useAuth();
  const [params, setParams] = useState({
    page: 1,
    limit: 25,
    search: '',
    type: forType,
    showCousin: false,
    gender,
    excludeId,
    descendant
  });

  const { data, isLoading, isFetching, error } = useGetMembersQuery({
    search: params.search,
    page: params.page,
    limit: params.limit,
    for: params.type,
    gender: params.gender,
    excludeId: params.excludeId,
    descendant: params.descendant,
    showCousin: params.showCousin,
  });

  const members = data?.data || [];
  const mainMemberID = data?.mainMemberId ?? -1;
  const hasMore = data ? members.length < data.totalCount : true;

  const handleSetSearchFilter = useDebounce((value: string) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: value,
      page: 1,
    }));
  }, 900);

  const handleShowCousin = () => {
    setParams((prevParams) => ({
      ...prevParams,
      showCousin: !prevParams.showCousin,
      page: 1,
    }));
  }

  const handleMemberSearch = (input: string) => {
    setSearchInput(input);
    handleSetSearchFilter(input);
  };

  const selectedValues = getSelectedValues['children'] || [];

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

  useEffect(() => {
    setAppliedFilters(getFiltersFor(forType, gender));
    setParams(prev => ({
      ...prev,
      type: forType,
      gender,
      excludeId,
      descendant,
      page: 1
    }));
  }, [forType, gender, excludeId, descendant]);

  useEffect(() => {
    if (error) {
      const message = (error as any)?.data?.message || 'Failed to fetch members';
      toast?.show(message, 'error', 5000);
      if ((error as any)?.status === 401) {
        logout();
      }
    }
  }, [error, toast, logout]);

  useEffect(() => {
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
  }, [hasMore, isFetching]);

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
      case ForType.SelectMember || ForType.EditMember:
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
        className={`${forType === ForType.SelectChildren && 'pb-14'} h-[60vh] md:h-[calc(100vh-154px)] overflow-y-auto scroll-stable`}
      >
        {forType === ForType.SelectPartner && descendant === true && (
          <div className="py-2 px-4 flex justify-end items-center gap-2 bg-main_background text-sm border-b border-border_color">
            <p>Show Cousins List</p>
            <label className="relative inline-flex items-center cursor-pointer p-1">
              <span className="absolute left-[4px] z-10">
                <Cross />
              </span>
              <input
                className="sr-only peer"
                type="checkbox"
                checked={params.showCousin}
                onChange={handleShowCousin}
              />
              <span className="absolute right-[4px] z-10">
                <Tick />
              </span>
              <div className={`
              peer ring-1 bg-black ring-gray-600 rounded-full outline-none duration-300 after:duration-500 
              w-[31.5px] h-[14px] peer-focus:outline-none after:content-[''] after:rounded-full after:absolute
              after:outline-none after:h-4 after:w-4 after:bg-main_background after:top-1/2 
              after:-translate-y-1/2 after:flex after:justify-center after:items-center 
              after:border-2 after:border-gray-600 
              ${params.showCousin ? 'after:translate-x-[16px]' : 'after:translate-x-0'} 
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
              {(isLoading || isFetching) && <p className="py-2 px-4 text-text_color">Loading...</p>}
              {!isLoading && !isFetching && !hasMore && members.length > 0 && <p>, , ,</p>}
            </div>
          </>
          : (isLoading || isFetching) ? <p className="py-4 text-center text-text_color loading-text">Loading....</p>
            : (error as any) ? <div className="p-6 text-center">{(error as any)?.data?.message || 'Failed to fetch members'}</div>
              : <div>{renderNoMembersMessage()}</div>}
      </div>

      {multiselect && <ButtonSolid buttonText={selectedValues.length <= 0 ? 'Close' : 'Submit'} onClick={() => openList((prev: any) => !prev)} className={`w-full absolute bottom-0 left-0 right-0 z-10 rounded-none mx-auto`} />}
    </Container>
  );
}
