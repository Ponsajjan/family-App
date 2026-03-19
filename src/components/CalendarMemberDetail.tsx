'use client'
import useSWR from 'swr';
import MemberDetails from './MemberDetails';

export default function CalendarMemberDetail({ memberId }: any) {
  const {
    data: swrResult,
    error,
    isLoading: loadingDetails
  } = useSWR(memberId ? `/api/relatives/${memberId}` : null);

  const data = swrResult?.data;

  if (error) return <div className='p-4'>Error: {error.message || 'Error fetching data'}</div>;
  if (!data && !loadingDetails) return <div className='p-4 loading-text'>No data found</div>;

  return (
    <div className='text-text_color py-2 relative bg-main_background scroll-stable'>
      {loadingDetails ? <span>Loading...</span> : (
        <MemberDetails data={data} />
      )}
    </div>
  );
}