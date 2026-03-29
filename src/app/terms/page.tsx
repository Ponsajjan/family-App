"use client"

import { useEffect, useState } from 'react'
import { useToast } from '@/components/Toast'
import { useAuth } from '@/contexts/AuthContext'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { fetchTermsData } from '@/store/slices/termsSlice'
import Loading from '@/components/Loading'

export default function Terms() {
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, moderatorGroups, mainMemberName } = useSelector((state: RootState) => state.terms);
  const { logout } = useAuth();

  useEffect(() => {
    // Skip if already fetched by AppInitializer
    if (mainMemberName) return;
    dispatch(fetchTermsData())
      .unwrap()
      .catch((error: any) => {
        if (error?.status === 401) {
          logout();
        } else if (error?.message) {
          toast?.show(error.message, 'error', 5000);
        }
      });
  }, [dispatch, logout, toast, mainMemberName]);

  return (
    <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-4">
      <div className="text-xl font-medium md:font-semibold mb-2">
        {moderatorGroups.some(g => g.moderators.length > 1) || moderatorGroups.length > 1 ? 'Moderators:' : 'Moderator:'}
      </div>
      {loading ? <Loading /> : moderatorGroups.map((group: any, idx: number) => (
        <div key={group.id || idx} className={idx > 0 ? 'mt-4 pt-4 border-t border-border_color' : ''}>
          {moderatorGroups.length > 1 && (
            <div className='font-medium mb-2 opacity-80 text-sm italic'>
              {group.mainMemberName} Family
            </div>
          )}
          <ul>
            {group.moderators.map((member: any, index: number) => (
              <li key={index} className='flex items-end justify-between mb-1'>
                <span>{member.moderatorName}</span>
                <span className='border-b border-dashed border-border_color block w-full mx-2 mb-2' />
                <span>{member.moderatorContact}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}