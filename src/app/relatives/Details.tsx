'use client'
import Container from '@/components/Container';
import { CloseIcon } from '@/utils/Icons';
import React, { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import MemberDetails from '@/components/MemberDetails';

export default function Details({ showMember, openDetails }: any) {
  const [data, setData] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        setError(null);
        setLoadingDetails(true);
        const response = await fetch(`/api/relatives/${showMember}`, {
          headers: { 
            'Content-Type': 'application/json'
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update member");
        }
        const { data } = await response.json();
        setData(data);
      } catch (error: any) {
        setError(error.message || 'Error fetching data');
      } finally {
        setLoadingDetails(false);
      }
    };
  
    if (showMember) {
      fetchMemberDetails();
    }
  }, [showMember]);

  if (error) return <div className='p-4'>Error: {error}</div>;
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
