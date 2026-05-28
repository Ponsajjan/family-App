'use client'
import Container from '@/components/Container';
import { CloseIcon } from '@/utils/Icons';
import Loading from '@/components/Loading';
import MemberDetails from '@/components/MemberDetails';
import useSWR from 'swr';
import { appFetch } from '@/utils/appFetch';
import { useEffect } from 'react';


export default function Details({ showMember, openDetails }: any) {
  // no-op selector or just remove if possible. Adding one to avoid empty destructuring if needed, but here we can just remove.
  const url = showMember ? `/api/relatives/${showMember}` : null;
  const {
    data: swrResult,
    error,
    isLoading: loadingDetails,
    mutate
  } = useSWR(url);

  useEffect(() => {
    // Only check version if data is present at the moment showMember changes (from SWR cache)
    if (swrResult?._version && showMember) {
      const checkMemberVersion = async () => {
        const currentVersion = JSON.stringify(swrResult._version);

        try {
          const res = await appFetch(`/api/auth/versionCheck/member?memberId=${showMember}&version=${encodeURIComponent(currentVersion)}`);
          if (res.ok) {
            const result = await res.json();
            if (result.mismatch) {
              console.log(`[VersionCheck] Stale details detected for member ${showMember}. Updating...`);
              const { clearPWACaches } = await import("@/utils/pwaCache");
              await clearPWACaches();
              await mutate(result.data, false);
            }
          }
        } catch (err) {
          console.error("[Details] Version check failed:", err);
        }
      };
      checkMemberVersion();
    }
  }, [showMember, mutate]);

  const data = swrResult?.data;

  return (
    <Container className='text-text_color bg-main_background relative'>
      {/* Sticky Close Button Container */}
      <div className="sticky top-0 z-30 h-0 w-full pointer-events-none">
        <div className="relative w-full h-0">
          <button
            onClick={() => openDetails(false)}
            aria-label="Close member details"
            className="absolute top-4 right-4 border border-border_color rounded-md cursor-pointer pointer-events-auto z-20"
          >
            <CloseIcon aria-hidden="true" />
          </button>
        </div>
      </div>

      {error ? (
        <div className='p-6'>Error: {error?.message || 'Error fetching data'}</div>
      ) : !data && !loadingDetails ? (
        <div className='p-6 loading-text'>No data found</div>
      ) : loadingDetails ? (
        <div className='p-4'><Loading /></div>
      ) : (
        <MemberDetails data={data} />
      )}
    </Container>
  );
}