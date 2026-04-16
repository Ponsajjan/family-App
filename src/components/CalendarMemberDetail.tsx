'use client'
import useSWR from 'swr';
import MemberDetails from './MemberDetails';
import { useVersionCheck } from '@/hooks/useVersionCheck';
import { useEffect } from 'react';

export default function CalendarMemberDetail({ memberId }: any) {
  const { checkVersion } = useVersionCheck();
  const url = memberId ? `/api/relatives/${memberId}` : null;
  const {
    data: swrResult,
    error,
    isLoading: loadingDetails
  } = useSWR(url);

  useEffect(() => {
    if (!loadingDetails) {
      checkVersion(url);
    }
  }, [url]);

  const data = swrResult?.data;

  return (
    <div className='text-text_color py-2 relative bg-main_background scroll-stable'>
      {error ? (
        <div className='p-4'>Error: {error.message || 'Error fetching data'}</div>
      ) : !data && !loadingDetails ? (
        <div className='p-4 loading-text'>No data found</div>
      ) : loadingDetails ? (
        <span>Loading...</span>
      ) : (
        <MemberDetails data={data} />
      )}
    </div>
  );
}