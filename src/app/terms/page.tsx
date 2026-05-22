"use client"

import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import Loading from '@/components/Loading'
import Link from 'next/link';

export default function Terms() {
  const { loading, moderatorGroups } = useSelector((state: RootState) => state.terms);

  return (
    <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-4">
      <div className="text-xl font-medium md:font-semibold mb-2">
        {moderatorGroups.some(g => g.moderators.length > 1) || moderatorGroups.length > 1 ? 'Moderators:' : 'Moderator:'}
      </div>
      {loading ? <div className='px-2 mb-1'>Loading...</div> : moderatorGroups.map((group: any, idx: number) => (
        <div key={group.id || idx} className={idx > 0 ? 'mt-4 pt-4 border-t border-border_color' : ''}>
          {moderatorGroups.length > 1 && (
            <div className='font-medium mb-2 opacity-80 text-sm italic'>
              {group.mainMemberName} Family
            </div>
          )}
          <ul>
            {group.moderators.map((member: any, index: number) => (
              <li key={index} className='mb-1'>
                <Link href={`tel:${member.moderatorContact}`} className='flex items-end justify-between'>
                  <span>{member.moderatorName}</span>
                  <span className='border-b border-dashed border-border_color block w-full mx-2 mb-2' />
                  <span>{member.moderatorContact}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}