import Container from '@/components/Container';
import { HoldButton } from '@/components/HoldButton';
import Loading from '@/components/Loading';
import { useToast } from '@/components/Toast';
import { CloseIcon, NavIconVerified } from '@/utils/Icons';
import { getCookie } from 'cookies-next';
import { useState, useEffect } from 'react';

const ChangeRequestView = ({ showDetailsFor, setShowDetails, currentDetailIndex, setCurrentDetailIndex }: any) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = getCookie('token');
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!showDetailsFor || !Array.isArray(showDetailsFor) || showDetailsFor.length === 0) {
        setData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/moderator/verifyChange/${showDetailsFor[currentDetailIndex].id}`, {
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
  }, [showDetailsFor, currentDetailIndex, token]);

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
      const response = await fetch(`/api/moderator/verifyChange/${showDetailsFor[currentDetailIndex].id}`, {
        method: 'DELETE',
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
      
      const result = await response.json();
      toast?.show(result.message || "Change verification approved", "success", 5000);
    } catch (error:any) {
      console.log("error", error)
      toast?.show(error.message || "Error handling verification", "error", 5000);
    } finally {
      setLoading(false);
    }
  }

  const handleRejectChanges = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/moderator/verifyChange/${showDetailsFor[currentDetailIndex].id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update member");
      }
      
      const result = await response.json();
      toast?.show(result.message || "Change verification rejected", "success", 5000);
    } catch (error:any) {
      console.log("error", error)
      toast?.show(error.message || "Error handling verification", "error", 5000);
    } finally {
      setLoading(false);
    }
  }
  
  if (error) return <div className='p-4'>Error: {error}</div>;
  if (!data) return <div className='p-4 loading-text'>No data found</div>;

  return (
    <Container className='text-text_color p-4 relative bg-main_background'>
      <div onClick={() => setShowDetails(false)} className='hidden md:block absolute top-0 right-0 border border-border_color rounded-md m-2 cursor-pointer'><CloseIcon /></div>
        <div className='flex justify-between items-center'>
          <div className='text-xl font-semibold mb-2 flex gap-2'>
            <span><NavIconVerified /></span>
            <span>Verify Changes</span>
          </div>
          {showDetailsFor.length > 1 && (
            <div className='flex mr-10'>
              <span 
                className={`block cursor-pointer bg-field_color text-center mx-2 border border-border_color rounded-md min-w-6 min-h-6 ${
                  currentDetailIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handlePrevious}
              >{`<`}</span>
              <span>{currentDetailIndex + 1}/{showDetailsFor.length}</span>
              <span 
                className={`block cursor-pointer bg-field_color text-center mx-2 border border-border_color rounded-md min-w-6 min-h-6 ${
                  currentDetailIndex === showDetailsFor.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleNext}
              >{`>`}</span>
            </div>
          )}
      </div>
      { loading
      ? <Loading />
      : <>
      <div dangerouslySetInnerHTML={{ __html: data.htmlContent }} />
      <div className='flex flex-col mt-4 gap-2'>
        <HoldButton buttonText='Approve changes' onClick={handleApproveChanges}/>
        <HoldButton type='outline' buttonText='Reject changes' onClick={handleRejectChanges} />
      </div>
      </>}
    </Container>
  );
};

export default ChangeRequestView;