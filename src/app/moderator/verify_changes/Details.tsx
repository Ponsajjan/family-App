import Container from '@/components/Container';
import { HoldButton } from '@/components/HoldButton';
import Loading from '@/components/Loading';
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

const ChangeRequestView = ({ showDetailsFor }: any) => {
  const [data, setData] = useState<ChangeRequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/moderator/verifyChange/${showDetailsFor}`);
        
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
    if (showDetailsFor) {
        fetchData();
    } else {
      return
    }

  }, [showDetailsFor]);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found</div>;

  return (
    <Container className='text-text_color py-6 px-4 relative bg-main_background scroll-stable'>
      {/* <h2 className="text-xl font-bold mb-4">Change Request Details</h2> */}
      <div dangerouslySetInnerHTML={{ __html: data.htmlContent }} />
      <div className='flex flex-col mt-4 gap-2'>
        <HoldButton buttonText='Approve changes' onClick={() => console.log("hi")}/>
        <HoldButton type='outline' buttonText='Reject changes' onClick={() => console.log("hello")} />
      </div>
    </Container>
  );
};

export default ChangeRequestView;