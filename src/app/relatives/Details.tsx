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
    <Container className='text-text_color py-6 px-4 relative bg-main_background scroll-stable'>
      <div onClick={() => openDetails(false)} className='hidden md:block absolute top-0 right-0 border border-border_color rounded-md m-2 cursor-pointer'>
        <CloseIcon />
      </div>

      {error ? (
        <div className='p-4'>Error: {error.message || 'Error fetching data'}</div>
      ) : !data && !loadingDetails ? (
        <div className='p-4 loading-text'>No data found</div>
      ) : loadingDetails ? (
        <Loading />
      ) : (
        <MemberDetails data={data} />
      )}
    </Container>
  );
}