'use client'
import Container from '@/components/Container';
import { CloseIcon } from '@/utils/Icons';
import Loading from '@/components/Loading';
import MemberDetails from '@/components/MemberDetails';
import useSWR from 'swr';

export default function Details({ showMember, openDetails }: any) {
  const { 
    data: swrResult, 
    error, 
    isLoading: loadingDetails 
  } = useSWR(
    showMember ? `/api/relatives/${showMember}` : null
  );

  const data = swrResult?.data;

  if (error) return <div className='p-4'>Error: {error.message || 'Error fetching data'}</div>;
  if (!data && !loadingDetails) return <div className='p-4 loading-text'>No data found</div>;

  return (
    <Container className='text-text_color py-6 px-4 relative bg-main_background scroll-stable'>
      <div onClick={() => openDetails(false)} className='hidden md:block absolute top-0 right-0 border border-border_color rounded-md m-2 cursor-pointer'>
        <CloseIcon />
      </div>

      {loadingDetails ? <Loading /> : (
        <MemberDetails data={data} />
      )}
    </Container>
  );
}