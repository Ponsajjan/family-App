'use client'
import React, { useEffect, useState } from 'react';
import MemberDetails from './MemberDetails';

export default function CalendarMemberDetail({ memberId }: any) {
  const [data, setData] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        setError(null);
        setLoadingDetails(true);
        const response = await fetch(`/api/relatives/${memberId}`, {
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
  
    if (memberId) {
      fetchMemberDetails();
    }
  }, [memberId]);

  if (error) return <div className='p-4'>Error: {error}</div>;
  if (!data && !loadingDetails) return <div className='p-4 loading-text'>No data found</div>;

  return (
    <div className='text-text_color py-2 relative bg-main_background scroll-stable'>
        {loadingDetails ? <span>Loading...</span> : (
        <MemberDetails data={data} />
      )}
    </div>
  );
}
