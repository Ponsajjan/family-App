'use client'
import useSWR from 'swr';
import MemberDetails from './MemberDetails';
import { appFetch } from '@/utils/appFetch';
import { useEffect } from 'react';


export default function CalendarMemberDetail({ memberId }: any) {
  const url = memberId ? `/api/relatives/${memberId}` : null;
  const {
    data: swrResult,
    error,
    isLoading: loadingDetails,
    mutate
  } = useSWR(url);

  useEffect(() => {
    // Only check version if data is present at the moment memberId changes (from SWR cache)
    if (swrResult?._version && memberId) {
      const checkMemberVersion = async () => {
        const currentVersion = JSON.stringify(swrResult._version);

        try {
          const res = await appFetch(`/api/auth/versionCheck/member?memberId=${memberId}&version=${encodeURIComponent(currentVersion)}`);
          if (res.ok) {
            const result = await res.json();
            if (result.mismatch) {
              console.log(`[VersionCheck] Stale details detected for member ${memberId}. Updating...`);
              const { clearPWACaches } = await import("@/utils/pwaCache");
              await clearPWACaches();
              await mutate(result.data, false);
            }
          }
        } catch (err) {
          console.error("[CalendarMemberDetail] Version check failed:", err);
        }
      };
      checkMemberVersion();
    }
  }, [memberId, mutate]);




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