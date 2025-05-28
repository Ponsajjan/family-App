import Container from '@/components/Container';
import { HoldButton } from '@/components/HoldButton';
import Loading from '@/components/Loading';
import { useToast } from '@/components/Toast';
import { Approved, CloseIcon, NavIconVerified, Rejected } from '@/utils/Icons';
import { getCookie } from 'cookies-next';
import { useState, useEffect } from 'react';

const ChangeRequestView = ({ 
  showDetailsFor, 
  setShowDetails, 
  currentDetailIndex, 
  setCurrentDetailIndex,
  setShowDetailsFor,
  setChangeList,
  memberId
}: any) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [error, setError] = useState<string | null>(null);
  const token = getCookie('token');
  const toast = useToast();

  // Process request removal and move to next
  const processRequestRemoval = () => {
    const updatedRequests = showDetailsFor.filter(
      (_: any, index: number) => index !== currentDetailIndex
    );
    
    setShowDetailsFor(updatedRequests);
    
    // If no more requests, clean up
    if (updatedRequests.length === 0) {
      setChangeList((prev: any) => prev.filter((item: any) => item.id !== memberId));
      setShowDetails(false);
    }
    // Adjust index if we removed the last item
    else if (currentDetailIndex >= updatedRequests.length) {
      setCurrentDetailIndex(updatedRequests.length - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!showDetailsFor || !Array.isArray(showDetailsFor)) {
        setData(null);
        setLoading(false);
        return;
      }

      // If no more requests, reset
      if (showDetailsFor.length === 0) {
        setChangeList((prev: any) => prev.filter((item: any) => item.id !== memberId));
        return;
      }

      // Ensure current index is valid
      const validIndex = Math.min(currentDetailIndex, showDetailsFor.length - 1);
      if (validIndex !== currentDetailIndex) {
        setCurrentDetailIndex(validIndex);
        return;
      }

      try {
        setError(null);
        setDisableButton(false);
        setLoading(true);
        setRequestStatus('pending');
        
        const response = await fetch(`/api/moderator/verifyChange/${showDetailsFor[validIndex].id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch request");
        }
        
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showDetailsFor, currentDetailIndex, token, memberId, setChangeList]);

  const handleNext = () => {
    if (showDetailsFor && currentDetailIndex < showDetailsFor.length - 1) {
      setCurrentDetailIndex(currentDetailIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentDetailIndex > 0) {
      setCurrentDetailIndex(currentDetailIndex - 1);
    }
  };

  const handleApproveChanges = async () => {
    try {
      setLoading(true);
      setDisableButton(true);

      if (!data?.submitData || !showDetailsFor[currentDetailIndex]?.id) {
        throw new Error("Invalid request data");
      }
      
      const response = await fetch(`/api/moderator/verifyChange/${showDetailsFor[currentDetailIndex].id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data.submitData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update member");
      }
      
      // const result = await response.json();
      // toast?.show(result.message || "Change verification approved", "success", 5000);
      setRequestStatus('approved');
      
      // Show status for 2 second before removing
      setTimeout(processRequestRemoval, 2000);
      
    } catch (error: any) {
      console.error("error", error);
      toast?.show(error.message || "Error handling verification", "error", 5000);
      setDisableButton(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectChanges = async () => {
    try {
      setLoading(true);
      setDisableButton(true);

      const response = await fetch(`/api/moderator/verifyChange/${showDetailsFor[currentDetailIndex].id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reject request");
      }
      
      // const result = await response.json();
      // toast?.show(result.message || "Change verification rejected", "success", 5000);
      setRequestStatus('rejected');
      
      // Show status for 2 second before removing
      setTimeout(processRequestRemoval, 2000);
      
    } catch (error: any) {
      console.error("error", error);
      toast?.show(error.message || "Error handling verification", "error", 5000);
      setDisableButton(false);
    } finally {
      setLoading(false);
    }
  };
  
  if (!showDetailsFor || showDetailsFor.length === 0) return <div className='p-4'>No pending requests</div>;
  if (!data && !loading) return <div className='p-4 loading-text'>No data found</div>;

  return (
    <Container className='text-text_color p-4 relative bg-main_background'>
      <div onClick={() => setShowDetails(false)} className='hidden md:block absolute top-0 right-0 border border-border_color rounded-md m-2 cursor-pointer'>
        <CloseIcon />
      </div>
      
      <div className='flex justify-between items-center'>
        <div className='text-xl font-semibold mb-2 flex gap-2'>
          <span><NavIconVerified /></span>
          <span>Verify Changes</span>
        </div>
        {showDetailsFor?.length > 1 && (
          <div className='flex mr-10'>
            <button
              disabled={loading || disableButton || currentDetailIndex === 0}
              className={`block cursor-pointer bg-field_color text-center mx-2 border border-border_color rounded-md min-w-6 min-h-6 ${
                currentDetailIndex === 0 || loading || disableButton 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
              onClick={handlePrevious}
            >{`<`}</button>
            
            <span>{currentDetailIndex + 1}/{showDetailsFor.length}</span>
            
            <button
              disabled={loading || disableButton || currentDetailIndex === showDetailsFor.length - 1}
              className={`block cursor-pointer bg-field_color text-center mx-2 border border-border_color rounded-md min-w-6 min-h-6 ${
                currentDetailIndex === showDetailsFor.length - 1 || loading || disableButton 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
              onClick={handleNext}
            >{`>`}</button>
          </div>
        )}
      </div>
      
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className='relative'>
            {data && <div dangerouslySetInnerHTML={{ __html: data.htmlContent }} />}
            {error && <div className='p-4'>Error: {error}</div>}
            <div className='absolute right-4 bottom-4'>
              {requestStatus === 'approved' && <Approved />}
              {requestStatus === 'rejected' && <Rejected />}
            </div>
          </div>
          <div className='flex flex-col mt-6 gap-2'>
            <HoldButton 
              disabled={disableButton || requestStatus !== 'pending'} 
              buttonText='Approve changes' 
              onClick={handleApproveChanges}
            />
            <HoldButton 
              disabled={disableButton || requestStatus !== 'pending'} 
              type='outline' 
              buttonText='Reject changes' 
              onClick={handleRejectChanges} 
            />
          </div>
        </>
      )}
    </Container>
  );
};

export default ChangeRequestView;