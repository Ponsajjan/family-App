import Container from '@/components/Container';
import { HoldButton } from '@/components/HoldButton';
import Loading from '@/components/Loading';
import { CloseIcon } from '@/utils/Icons';
import { getCookie } from 'cookies-next';
import { useState, useEffect } from 'react';

// types.ts (or at the top of your component file)
export interface ChangeRequestData {
    formData: {
      id: number;
      name: string | null;
      gender: string | null;
      birth_date: string | null;
      birth_month: string | null;
      birth_year: string | null;
      deceased: boolean | null;
      death_date: string | null;
      death_month: string | null;
      death_year: string | null;
      phone_number: string | null;
      occupation: string | null;
      education: string | null;
      address: string | null;
      descendant: string;
      father: string | null;
      mother: string | null;
      siblings: string | null;
    };
    changeData: Record<string, any>;
    htmlContent: string;
  }
  
  export interface ApiResponse {
    data: ChangeRequestData;
  }

const ChangeRequestView = ({ showDetailsFor, setShowDetails, currentDetailIndex, setCurrentDetailIndex }: any) => {
  const [data, setData] = useState<ChangeRequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = getCookie('token');

  console.log("showDetailsFor", showDetailsFor);

  useEffect(() => {
    const fetchData = async () => {
      // Return early if showDetailsFor is empty or not an array
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
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

  // console.log("data", data?.formData);
  
  if (error) return <div className='p-4'>Error: {error}</div>;
  if (!data) return <div className='p-4'>No data found</div>;

  return (
    <Container className='text-text_color p-4 relative bg-main_background scroll-stable'>
      <div onClick={() => setShowDetails(false)} className='hidden md:block absolute top-0 right-0 mt-2 mr-1 cursor-pointer'><CloseIcon /></div>
        <div className='flex justify-between items-center'>
          <div className='text-xl font-semibold mb-2'>Verify Changes</div>
          {showDetailsFor.length > 1 && (
            <div className='flex mr-4'>
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
        <HoldButton buttonText='Approve changes' onClick={() => console.log("hi")}/>
        <HoldButton type='outline' buttonText='Reject changes' onClick={() => console.log("hello")} />
      </div>
      </>}
    </Container>
  );
};

export default ChangeRequestView;